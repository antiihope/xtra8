const GenID = () => {
  let r = (Math.random() + 1).toString(36).substring(7);
  return r;
};

window.print = console.log;
let els = {};
var str = JSON.stringify;

function CheckType(type) {
  if (window.useEffect == undefined) {
    window.useEffect = {};
  }
  if (els == undefined) {
    els = {};
  }
  if (els[type] !== undefined) {
    els[type] = els[type] + 1;
  } else {
    els[type] = 0;
  }

  return els[type];
  // try {
  //   z = document.querySelector('#parent');
  //   z = z.firstElementChild;
  //   var e = z.querySelectorAll(type).length + 1;
  //   return e + z.childElementCount;
  // } catch (error) {
  //   return 0;
  // }
}
function SET_VALUES(values, type, children) {
  var PAGE = ThisPageName();
  var COUNT = CheckType(type);

  if (values == null) values = {};
  if (values.hasOwnProperty('if')) {
    if (!values.if || values.if == undefined) {
      return 'stop';
    }
  }
  var id;

  id = PAGE + type + COUNT;

  // assign id if not already there  , for easier  Callback

  if (values == null) {
    var values = {};

    values.id = id;
  }

  if (values.id == undefined) values.id = id;
  var id = values.id;

  if (id.length == 0) id = id;

  // look for useeffect and call it or ignore it
  var Checkin = values.useEffect || type.useEffect || false;
  if (Checkin) {
    if (typeof Checkin == 'function') {
      if (!window.useEffect[id]) {
        Checkin();
        window.useEffect[id] = true;
      }
    }
  }
  return values;
}

var React = {
  createElement: function createElement(type, values, ...children) {
    if (type == 'route') {
      print(type, values);
    }

    var props = SET_VALUES(values, type, children.length);

    if (props == 'stop') {
      return '';
    }

    if (type !== undefined) {
      if (typeof type == 'function') {
        var props = SET_VALUES(values, type, children.length);
        props.id = type.name;

        props.children = children;
        type.props = props;
        return type(props);
      }
    } else {
      return '';
    }

    var element = document.createElement(type);

    Object.assign(element, { ...props, ...values });

    children.forEach((z) => {
      if (typeof z == 'function') {
        // print(z);
        vdom[z.name] = z;
        var newz = z();
        newz.id = z.name;
        element.append(newz);
      } else {
        // this to look for loops in element children
        if (Array.isArray(z)) {
          // console.log(z);
          z.forEach((typos) => {
            element.append(typos);
          });
        } else {
          element.append(z);
        }
      }
    });

    return element;
  },
};

window.React = React;
window.el = (x) => {
  return document.getElementById(x);
};
Element.prototype.insertChildAtIndex = function (child, index) {
  if (!index) index = 0;
  if (index >= this.children.length) {
    this.appendChild(child);
  } else {
    this.insertBefore(child, this.children[index]);
  }
};

function UPDATE_DOM(newdom = false) {
  if (!window.Loaded) {
    print('not yet loaded');
    window.finished = true;
    window.Loaded = true;
    return;
  }

  window['focused'] = document.activeElement.id;
  var external;
  external = true;
  if (newdom == false) {
    external = false;

    els = {};

    var newdom = window.vdom();
  } else {
    external = newdom;
    newdom = external();
  }
  var root = el('parent');
  var oldDom = root.childNodes[0];

  var matchs = newdom.innerHTML == oldDom.innerHTML;

  if (!matchs) {
    window['olDom'] = oldDom;
    // what this function?! you ask
    var changed = 0;
    var oldDom = root.childNodes[0];
    var clone = oldDom.cloneNode(true);

    //  STOP JUDGIN ME .. .I WAS DRUNK ↓↓
    function tryes(repeat = false) {
      window.fullscreen = document.fullscreenElement;

      window.finished = false;
      try {
        function getElementAttrs(el) {
          var obj = {};
          var arr = ['disabled', 'class', 'className', 'href', 'src', 'id'];
          arr.forEach((attr) => {
            obj[attr] = el[attr];
          });
          return obj;
        }

        function diff(arrayOne, arrayTwo) {
          var arrayThree = [];
          arrayOne.forEach((element) => {
            arrayTwo.forEach((element2) => {
              if (str(element) === str(element2)) {
                arrayOne = arrayOne.filter(function (item) {
                  return str(item) !== str(element);
                });
                // arrayOne.remove(element);
              }
            });
          });
          return arrayOne;
        }

        function childtoarray(x, i = false) {
          // pass node element , turn it into object of its id and inner html and attrs
          var z = [[], []];
          // push parent element id , to check if the page has change or not later
          z[1].push(x[0].parentElement.id || false);

          x.forEach((element) => {
            var indexfromx = [...element.parentElement.children].indexOf(
              element
            );

            var index = [...newdom.childNodes].indexOf(element);
            var oldelement = oldDom.childNodes[index];
            var value = false;
            let children = false;
            if (element.tagName == 'DIV') {
              children = childtoarray(element.childNodes);
            }
            if (oldelement) {
              value = oldelement;
            }
            if (i) {
              els = i[indexfromx];
              if (typeof els == 'object') {
                value = els;
              }
            }
            z[0].push({
              inner: element.innerHTML || false,
              id: element.id || value.id,
              full: element || false,
              attrs: element.attributes || false,
              next: element.nextSibling,
              parent: element.parentElement,
              previous: element.previousSibling,
              index: indexfromx,
              children: children,
            });
          });
          return z;
        }

        var cloneDom = childtoarray(clone.childNodes);
        var old = childtoarray(oldDom.childNodes);
        var vso = childtoarray(newdom.childNodes, old[0]);

        // if parent element changed return false
        if (cloneDom[1][0] !== vso[1][0]) {
          if (!repeat) {
            print('not repeat');
            return tryes(true);
          } else {
            print('tryed and false not same', cloneDom[1][0], vso[1][0]);
            print(newdom);
            return false;
          }
        }
        // DONT GO NEAR >>>>>>>>>>>>>>>>>>>>>>>>>>DONT GO NEAR
        var Newi = diff(vso[0], cloneDom[0]);
        var Oldi = diff(cloneDom[0], vso[0]);
        // // print('new', Newi, 'old:', Oldi);

        var count = 0;
        function isInNew(id) {
          for (const key in Newi) {
            if (Newi[key].id == id) {
              return true;
            }
          }
          return false;
        }
        function OldiChange(Oldi) {
          Oldi.forEach((element) => {
            count = count + 1;
            if (!isInNew(element.id)) {
              var ele = el(element.id);
              if (ele) ele.remove();
              return;
            }

            try {
              var NEWELEMENT = Newi[count];
              if (NEWELEMENT) {
                if (NEWELEMENT.inner == false) {
                  el(NEWELEMENT.id).remove();
                  return;
                }
                var ele = el(NEWELEMENT.id);
                if (ele) {
                  if (element.children) {
                    var oldz = childtoarray(ele.childNodes);
                    var zero = diff(oldz, NEWELEMENT.children);
                    var one = diff(NEWELEMENT.children, oldz);
                    zero.forEach((element) => {
                      var ele = el(NEWELEMENT.id);
                      if (ele) ele.replaceWith(NEWELEMENT.full);
                    });
                    // return NewiChange(zero);
                    return;
                  }
                  var NewAttrs = getElementAttrs(NEWELEMENT.full);
                  var OldAttrs = getElementAttrs(element.full);
                  if (str(NewAttrs) == str(OldAttrs)) {
                    // print('same');
                    ele.innerHTML = element.full.innerHTML;
                    return;
                  } else {
                    ele.replaceWith(NEWELEMENT.full);
                  }
                } else {
                  var ele = el(element.id);
                  if (ele) {
                    ele.replaceWith(NEWELEMENT.full);
                    return;
                  }
                }
              }
            } catch (error) {
              return;
            }
          });
        }
        function NewiChange(Newi) {
          Newi.forEach((element) => {
            if (element.id) {
              var ele = el(element.id);

              if (ele) {
                if (element.children) {
                  var oldz = childtoarray(ele.childNodes);
                  var zero = diff(oldz, element.children);
                  var one = diff(element.children, oldz);
                  zero.forEach((element) => {
                    var ele = el(element.id);
                    if (ele) ele.replaceWith(element.full);
                  });
                  // return NewiChange(zero);
                  return;
                }
                var NewAttrs = getElementAttrs(element.full);
                var OldAttrs = getElementAttrs(ele);
                if (str(NewAttrs) == str(OldAttrs)) {
                  // print('same');
                  ele.innerHTML = element.full.innerHTML;
                  return;
                } else {
                  print('changed', element.id);
                  ele.replaceWith(element.full);
                }
              }
              // print(element);
              var parent = element.parent;
              var index = element.index;
              var realParent = el(parent.id);
              if (realParent) {
                realParent.insertChildAtIndex(element.full, index);
              }
            } else {
            }
          });
        }

        window.fullscreen = document.fullscreenElement;

        OldiChange(Oldi);
        NewiChange(Newi);
        if (fullscreen) {
          el(fullscreen.id).requestFullscreen();
        }

        // DONT GO NEAR<<<<<<<<<<<<<<<<<<<<<<<<<<DONT GO NEAR
        // oldDom = root.childNodes[0];
        // if (oldDom.innerHTML == newdom.innerHTML) {
        //   // print('YAAAAY');
        //   window.finished = true;
        //   window.succeed = window.succeed + 1;
        //   return true;
        // } else {
        //   // print('NOOO');
        //   print('New:', Newi, 'Old:', Oldi);
        //   window.finished = true;
        //   window.fails = window.fails + 1;
        //   return false;
        // }
        // print('New:', Newi, 'Old:', Oldi);

        return true;

        if (!repeat) {
          return tryes(true);
        }
        window.finished = true;

        // print(diss, cloneDom[0]);
        // breakS

        if (cloneDom[1][0] !== vso[1][0]) {
          if (!repeat) {
            if (!external) {
              newdom = window.vdom();
              return tryes(true);
            } else return false;
          } else {
            print('tryed and false not same', cloneDom[1][0], vso[1][0]);
            return false;
          }
        }
        // print(false);
        try {
          vso[0].forEach((element) => {
            var index = vso[0].indexOf(element);
            var olds = cloneDom[0][index];
            if (olds.inner !== element.inner) {
              var ele = clone.querySelector('#' + olds.id);
              if (ele) {
                ele.innerHTML = element.inner;
              } else {
                var id = olds.id;
                var ele = el(id);
                if (ele) {
                  ele.remove();
                }
              }
            }
          });
          if (clone.innerHTML == newdom.innerHTML) {
            vso[0].forEach((element) => {
              var index = vso[0].indexOf(element);
              var olds = old[0][index];
              if (olds.inner !== element.inner) {
                var ele = el(olds.id);
                if (ele) {
                  ele.innerHTML = element.inner;
                } else {
                  var id = olds.id;
                  var ele = el(id);
                  if (ele) {
                    ele.remove();
                  }
                }
              }
            });
          } else {
            if (!repeat) {
              if (!external) {
                newdom = window.vdom();
                return tryes(true);
              } else return false;
            } else {
              print('tryed and false not same', cloneDom[1][0], vso[1][0]);
              return false;
            }
          }
        } catch (error) {
          console.log('error in tryes() in updateDom 1 ');

          return false;
        }

        return true;
      } catch (error) {
        print(error);
        console.log('error in tryes() in updateDom');
        return false;
      }

      return false;
    }

    if (tryes() == false) {
      window.finished = true;
      print('returned false');
      var div = document.createElement('div');
      div.id = 'parent';
      div.append(ThisPage()());
      root.replaceWith(div);
      if (window.focused) {
        var focus = el(window.focused);
        if (focus) {
          focus.focus();
        }
      }
    }
    window.finished = true;

    if (window.onUpdate) {
      print('found on update');
      window.onUpdate();
    }
    els = {};
    window.finished = true;

    return;
  }
  window.finished = true;

  return;
}
// ↑↑↑ THIS WHOLE PART UPTHERE IS SO CONFUSING .. I DON EVEN KNOW HOW I WROTE IT ↑↑↑

function INIT(x) {
  var root = el('parent');
  var div = document.createElement('div');
  div.id = 'parent';
  div.append(x());
  // print(div);

  root.replaceWith(div);
  if (window.focused) {
    var focus = el(window.focused);
    if (focus) {
      focus.focus();
    }
  }
  return;
}

//  Returns the current page name
window.ThisPageName = () => {
  var name = location.hash.replace('#', '');
  if (name.length == 0) {
    var name = 'Main';
    return 'Main';
  }
  return name;
};

//  Returns the current page function
window.ThisPage = () => {
  var name = location.hash.replace('#', '');
  if (name.length == 0) {
    var name = 'Main';
    return APP.Routes['Main'];
  }
  if (window.APP.Routes[name] !== undefined) {
    return window.APP.Routes[name];
  } else return APP.Routes['Main'];
};

// MAIN THING , RENDERS ON DOM COMPLETE >> Sends passed function to INIT()
function render(x) {
  function Mok() {
    var React = React;
    var SET_VALUES = SET_VALUES;
    els = {};
    return x();
  }
  APP.Modules['Main'] = Mok;
  APP.Routes['Main'] = Mok;

  window.vdom = x;
  let stateCheck = setInterval(() => {
    if (document.readyState === 'complete') {
      clearInterval(stateCheck);
      var page = ThisPage();
      INIT(page);
    }
  }, 1);
}

async function getFetch(url) {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };

  return await fetch(url, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      return result;
    })
    .catch((error) => print('error', error));
}
// get modules  , parse it , eval it , append it to html
async function SetModulesFile(path, names) {
  names.forEach(async (name) => {
    var children = await getFetch(path + name);
    var parsed = Babel.transform(children, { presets: ['env', 'react'] }).code;
    var els = document.createElement('script');
    els.type = 'module';
    els.innerHTML = parsed;
    window.eval(parsed);
    document.head.append(els);
    return true;
  });
}

//Same thing  ..  I THOUGHT IT'S COOL ¯\(o_o)/¯
// async function req(file) {
//   var children = await getFetch(file);
//   var parsed = Babel.transform(children, { presets: ['env', 'react'] }).code;
//   var els = document.createElement('script');
//   els.type = 'module';
//   els.innerHTML = parsed;
//   window.eval(parsed);
//   return parsed;
//   document.head.append(els);
// }

// Set modules takes the function name and assigns it to APP object on window and Modules Object

var Modules = {
  SetModule: function (z, x) {
    var name = z.name;
    window.APP[name] = (x) => {
      var React = React;
      var SET_VALUES = SET_VALUES;
      els = {};
      return z(x);
    };
    this[name] = window.APP[name];
  },
  SetModulesFile: SetModulesFile,
};

// set multi-ple pages at once , almost useless LOL (•_•)
function Router(z) {
  for (var key in z) {
    if (key.length == 0) {
      key = 'Main';
    }
    function Callee() {
      location.hash = key;
      return z[key]();
    }
    window.APP[key] = Callee;
    print(key);
  }
}

// SET PAGE FOR HASH AND HASH FOR MODULE

var Route = (x, z) => {
  APP.Modules[x] = z;
  if (typeof z == 'function') {
    function Callee() {
      var React = React;
      var SET_VALUES = SET_VALUES;
      els = {};
      location.hash = x;
      return z();
    }

    window.APP.Routes[x] = Callee;
  } else {
    function Callee() {
      var React = React;
      var SET_VALUES = SET_VALUES;
      location.hash = x;
      els = {};

      return z;
    }

    window.APP.Routes[x] = Callee;
  }
};

window.updates = {};
// i really dont know dude I THOUGHT IT'S COOL ¯\(o_o)/¯

function useEffect(fn, mainfn) {
  mainfn.useEffect = fn;
}

function useState(initialValue, Callback = false) {
  if (window.APP.values === undefined) {
    window.APP.values = {};
  }
  var id = GenID();
  window.APP.values[id] = initialValue;

  var state = {
    state: function state() {
      return window.APP.values[id];
    },
    get val() {
      return window.APP.values[id];
    },
    vals: (x) => {
      window.APP.values[id] = x;
    },
  };

  function setState(newVal, Callbacks = false) {
    els = {};
    if (!window.Loaded) {
      window.finished = true;
    }

    try {
      clearTimeout(window.timeout);
      // print('cleared');
    } catch (error) {
      print('not there');
    }

    //  WELL , we donna wanna call the update function for nothing  -_(0_0)_- , so we check if it's the same old value or not
    if (str(state.val) !== str(newVal)) {
      // print('updted', id, newVal);...
      state.vals(newVal);
      if (window.finished) {
        // see if it's another page and UPDATE accordinly =>
        if (Callbacks) Callbacks(newVal);
        return UPDATE_DOM(ThisPage());
      } else {
        print('not finished');
        updates[id] = { newVal: newVal, Callbacks: Callbacks };
        window.onUpdate = () => {
          function WhatUpdates() {
            var len = Object.keys(updates).length;
            print('updating ', Object.keys(updates).length, ' key');
            for (const key in updates) {
              var newVal = updates[key]['newVal'];
              window.APP.values[key] = newVal;
              var Callbacks = updates[key]['Callbacks'];
              if (Callbacks) Callbacks(newVal);
              delete updates[key];
            }
            return len;
          }
          if (WhatUpdates() > 0) {
            print('found on update');
            UPDATE_DOM();
            window.finished = true;
          } else {
            window.finished = true;
            delete window.onUpdate;
          }
        };

        return;
      }
    }
    return;
  }

  if (Callback) {
    Callback(initialValue);
  }
  return [state, setState];
}

// Just a hook i like ↓↓↓↓↓
function Listen(key, func) {
  return document.addEventListener('keydown', (e) => {
    // print(e.key);
    if (e.key == key) {
      func(e);
    } else {
      return e;
    }
  });
}

window.xtra8 = {
  React,
  render,
  Modules,
  useState,
  Router,
  useEffect,
  Route,
  Listen,
};
window.APP = window.xtra8;
APP.Routes = {};

export { React, render, Modules, useState, Router, useEffect, Route, Listen };

window.onhashchange = (e) => {
  var name = location.hash.replace('#', '');
  // print(name);
  if (name.length == 0) {
    var name = 'Main';

    return UPDATE_DOM();
  }

  if (window.APP.Routes[name] !== undefined) {
    return UPDATE_DOM(window.APP.Routes[name]);
  } else {
    // location.hash = '';
    // UPDATE_DOM();
  }
};

import * as NaminAnythingBlah from './babel.min.js';

window.fails = 0;
window.succeed = 0;
