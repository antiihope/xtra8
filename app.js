/** @jsx Fframework */

// class WatchedVariable {
//   // Watch Global window Var Change to manipulate it later
//   // src =https://stackoverflow.com/questions/1759987/listening-for-variable-changes-in-javascript
//   constructor(variableName, initialValue, callbackFunction, target) {
//     //set default values if missing
//     initialValue ??= null;
//     callbackFunction ??= function () {
//       console.log(variableName + ' changed to ' + window['_' + variableName]);
//     };
//     //and now the actual useful code!
//     Object.defineProperty(window, variableName, {
//       set: function (value) {
//         window['_' + variableName] = value;
//         if (value !== initialValue) {
//           callbackFunction(variableName, target, value, initialValue);
//         }
//       },
//       get: function () {
//         return window['_' + variableName];
//       },
//     });
//     window[variableName] = initialValue;
//     Object.assign(this, { variableName, initialValue, callbackFunction });
//   }
// }

function WatchValues(values, type) {
  // assign id if not already there  , for easier  Callback
  if (values == null) {
    var values = {};

    values.id = type;
    if (values.id == undefined) {
      values.id = type;
    }
  }
  values.onfocus = (e) => (window.focused = e.target.id);

  return values;
}

// callback function after window var change
function setListen(variableName, target, value, oldValue) {
  var target = el(target.id);

  var text = target.innerHTML;

  if (value.length == 0) {
    // console.log('aha');
    value = ' ';
  }
  var text = text.replace('' + oldValue, value);
  target.innerHTML = text;
  // watch the new variable for change again!
  new WatchedVariable(variableName, value, setListen, target);
}

var React = {
  createElement: (type, values, ...content) => {
    var element = document.createElement(type);
    // assign id if not already there  , for easier  Callback
    values = WatchValues(values, type);
    Object.assign(element, values);

    content.forEach((z) => {
      if (typeof z == 'function') {
        vdom[z.name] = z;
        var newz = z();
        newz.id = z.name;
        element.append(newz);
      } else {
        for (const key in window) {
          if (window[key] == z) {
            // Watch Global window Var Change to manipulate it later
            // new WatchedVariable(key, z, setListen, element);
          }
        }

        element.append(z);
      }
    });
    return element;
  },
};

window.el = (x) => {
  return document.getElementById(x);
};

window.iterate = function iterate(newdom = newdom, oldDom = oldDom) {
  var count = 0;

  for (const elx of newdom) {
    var x = newdom[count].isEqualNode(oldDom[count]);
    console.log(x);
    count = count + 1;
  }
};
function Update(newdom = false) {
  if (newdom == false) {
    var newdom = window.vdom();
  }
  var root = el('parent');
  var oldDom = root.childNodes[0];
  window['olDom'] = oldDom;

  var div = document.createElement('div');
  div.id = 'parent';
  div.append(newdom);
  root.replaceWith(div);
  if (window.focused) {
    var focus = el(window.focused);
    focus.focus();
  }
  return;
}

function main(x) {
  var root = el('parent');
  var div = document.createElement('div');
  div.id = 'parent';
  div.append(x());
  // console.log(div);
  root.replaceWith(div);
  if (window.focused) {
    var focus = el(window.focused);
    focus.focus();
  }
  return;
}

function render(x) {
  window.vdom = x;
  // window.OLDvdom = x();
  let stateCheck = setInterval(() => {
    if (document.readyState === 'complete') {
      clearInterval(stateCheck);
      main(x);
    }
  }, 100);
}

function State(z, x) {
  if (x.length == 0) {
    // console.log('aha');
    x = ' ';
    console.log(x.length);
  }

  window[z] = x;
  window['set' + z] = (c) => {
    if (c !== z) {
      // new value DIF from original SO UPDATE DOM
      window[z] = c;
      Update();
    }
  };
}

export { React, render, State };
