// Show Loading
function showLoading() {
  $.LoadingOverlay('show', {
    maxSize: 70
  });
}

function hideLoading() {
  $.LoadingOverlay('hide');
}

// Disabled Button
function disabledButton(buttonId) {
  $(buttonId).attr('disabled', true);
};

// Enable Button
function enableButton(buttonId) {
  $(buttonId).attr('disabled', false);
};

// Escape Data
function escape(data) {
    return data.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

function isAddForm() {
  return location.href.indexOf('add') >= 0;
}

function hasRequestQuery(fieldName) {
  return location.href.indexOf(fieldName) >= 0;
}

function truncate(string, length) {
  length = length || MIN_TRUNCATE_LENGTH;
  if (string !== null && string !== undefined && string.length > length) {
    return `${string.substr(0, length)}...`;
  } else {
    return string;
  }
}

jQuery.fn.extend({
  common: {
    commonAjaxErrorHandler: function(err, defaultError) {
      console.log(err);
      try {
        if (err.status === 408) {
          // dosome thing
        } else if (err.status === 401) { // Unauthorized
          // dosome thing
        } else {
          if (err.responseJSON) {
            alert(err.responseJSON.message);
          } else {
            // dosome thing
          }
        }
      } catch (err) {
        console.log(err);
        // dosome thing
        alert(defaultError || 'エラーが発生です。');
      }
    },
    setDatePicker: function(input, noValidate = false, onChange = undefined) {
      var datePicker = input.datepicker({
        language: 'ja',
        format: "yyyy/mm/dd",
        autoclose: true,
        beforeShow: function () {
          setTimeout(function () {
            $('.ui-datepicker').css('z-index', 99999999999999);
          }, 0);
        },
        showButtonPanel: true,
        changeMonth: true,
        changeYear: true
      });

      if (!noValidate) {
        datePicker.on('change', function (ev) {
          $(ev.target).valid();
        })
      }
      if (typeof onChange === 'function') {
        datePicker.on('change', onChange);
      }
    
      setTimeout(function() {
        input.attr('autocomplete', 'off');
      }, 300); // wait until datepicker input has been initialized
    },
    showLoading: function showLoading() {
      this.LoadingOverlay('show', {
        maxSize: 70
      });
    },
    hideLoading: function hideLoading() {
      this.LoadingOverlay('hide');
    },
    getCookie: function(name) {
      function parse(str) {
        var obj = {};
        var pairs = str.split(/ *; */);
        var pair;
        if ('' == pairs[0]) return obj;
        for (var i = 0; i < pairs.length; ++i) {
            pair = pairs[i].split('=');
            obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }
        return obj;
      }
      var parts = parse(document.cookie);
      return parts[name] === undefined ? null : parts[name];
    }
  }
});
