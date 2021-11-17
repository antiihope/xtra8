function GenID() {
  return (Math.random() + 1).toString(36).substring(7);
}
window.seeme = (e) => {
  window['focused'] = e.target.id;
};
function SetValues(values, type) {
  // assign id if not already there  , for easier  Callback
  if (values == null) {
    var values = {};

    values.id = type + 1;
  }
  if (values.id == undefined) {
    values.id = type + 1;
  }
  var id = values.id;
  if (id.length == 0) {
    values.id = type + 1;
  }
  values.onfocus = (e) => window.seeme(e);

  return values;
}

var React = {
  createElement: (type, values, ...content) => {
    var element = document.createElement(type);
    // assign id if not already there  , for easier  Callback
    values = SetValues(values, type);
    Object.assign(element, values);

    content.forEach((z) => {
      if (typeof z == 'function') {
        // console.log(z);
        vdom[z.name] = z;
        var newz = z();
        newz.id = z.name;
        element.append(newz);
      } else {
        // this to look for loops in element content
        if (Array.isArray(z)) {
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

window.el = (x) => {
  return document.getElementById(x);
};

function UpdateDom(newdom = false) {
  if (newdom == false) {
    var newdom = window.vdom();
  }
  var root = el('parent');
  var oldDom = root.childNodes[0];
  var matchs = newdom.innerHTML == oldDom.innerHTML;
  if (!matchs) {
    window['olDom'] = oldDom;

    var div = document.createElement('div');
    div.id = 'parent';
    div.append(newdom);
    root.replaceWith(div);
    if (window.focused) {
      var focus = el(window.focused);
      if (focus) {
        focus.focus();
      }
    }
    return;
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

function State(z, x, Callback = false) {
  if (x.length == 0) {
    // console.log('aha');
    x = ' ';
    console.log(x.length);
  }

  window[z] = x;
  if (Callback) {
    window['set' + z] = (c) => {
      console.log('update');

      if (c !== z) {
        // new value DIF from original SO UPDATE DOM
        Callback(c);
        window[z] = c;
        UpdateDom();
      }
    };
  } else {
    window['set' + z] = (c) => {
      if (c !== z) {
        // new value DIF from original SO UPDATE DOM

        window[z] = c;
        UpdateDom();
      }
    };
  }
}

function States(obj) {
  for (const key in obj) {
    window[key] = obj[key];
    window['set' + key] = (c) => {
      // new value DIF from original SO UPDATE DOM

      window[key] = c;
      UpdateDom();
    };
  }
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
    .catch((error) => console.log('error', error));
}

// get modules  , parse it , eval it , append it to html
async function SetModulesFile(path, names) {
  names.forEach(async (name) => {
    var content = await getFetch(path + name);
    var parsed = Babel.transform(content, { presets: ['env', 'react'] }).code;
    var els = document.createElement('script');
    els.type = 'module';
    els.innerHTML = parsed;
    window.eval(parsed);
    document.head.append(els);
    return true;
  });
}

async function req(file) {
  var content = await getFetch(file);
  var parsed = Babel.transform(content, { presets: ['env', 'react'] }).code;
  var els = document.createElement('script');
  els.type = 'module';
  els.innerHTML = parsed;
  window.eval(parsed);
  return parsed;
  document.head.append(els);
}

// Set modules to access it from diffrent js files
var Modules = {
  SetModule: function (z) {
    this[z.name] = z;
  },
  SetModulesFile: SetModulesFile,
};

window.xtra8 = { React, render, State, States, Modules, req };

export { React, render, State, States, Modules, req };
