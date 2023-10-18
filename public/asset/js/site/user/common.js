import { messages } from "../constants.js";

// Show Loading
export const showLoading = function() {
  $('#loading').removeClass('d-none');
};

// Hide Loading
export const hideLoading = function() {
  $('#loading').addClass('d-none');
};

// Disabled Button
export const disabledButton = function(buttonId) {
  $(buttonId).attr('disabled', true);
};

// Enable Button
export const enableButton = function(buttonId) {
  $(buttonId).attr('disabled', false);
};

// Escape Data
export const escape = function(data) {
    return data.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

// add method check max length for user name
export const checkMaxLength = function(nameMethod, maxLength, nameInput, selector) {
  $.validator.addMethod(
    nameMethod,
    function(value) {
      if (value.length > maxLength) {
        return false;
      } else {
        return true;
      }
    },
    `${messages.ECL002(nameInput, maxLength, $(selector).val().length)}`,
  );
}

// add method check date 
export const checkDateFormat = (nameMethod, nameInput) => {
  $.validator.addMethod(
    nameMethod,
    function(value) {
      let isValid;
      if (value.length == 0) return true;
      if(nameMethod == 'validateDateFormatDateTo') {
        isValid = checkDateMonthYearTo(value);
      }
      if(nameMethod == 'validateDateFormatDateFrom') {
        isValid = checkDateMonthYearFrom(value);
      }
      return isValid;
    },
    `${messages.ECL008(nameInput)}`,
  );
}


export const checkDateMonthYearFrom = (dateInput) => {
  const regex = /^\d{4}\/\d{2}\/\d{2}$/;
  if(regex.test(dateInput)) {
    let [year, month, date] = dateInput.split('/');
    const month_1 = parseInt('01');
    const month_2 = parseInt('02');
    const month_3 = parseInt('03');
    const month_4 = parseInt('04');
    const month_5 = parseInt('05');
    const month_6 = parseInt('06');
    const month_7 = parseInt('07');
    const month_8 = parseInt('08');
    const month_9 = parseInt('09');
    const month_10 = parseInt('10');
    const month_11 = parseInt('11');
    const month_12 = parseInt('12');

    if (year % 4 == 0) {
      if ( month == month_2 ) {
        if (date > 29) {
          return false;
        }
      }
    } else {
      if (month == month_2) {
        if (date > 28) {
          return false;
        }
      }
      if (month == month_4 || month == month_6 || month == month_9 || month == month_11) {
        if (date > 30) {
          return false;
        }
      }
      if(month == month_1 || month == month_3 || month == month_5 || month == month_7 || month == month_8 || month == month_10 || month == month_12) {
        if (date > 31) {
          return false;
        }
      }
    }

    if (month > month_12) {
      return false;
    }

    return true;
  } else {
    return false;
  }
}
export const checkDateMonthYearTo = (dateInput) => {
  const regex = /^\d{4}\/\d{2}\/\d{2}$/;
  if(regex.test(dateInput)) {
    let [year, month, date] = dateInput.split('/');
    const month_1 = parseInt('01');
    const month_2 = parseInt('02');
    const month_3 = parseInt('03');
    const month_4 = parseInt('04');
    const month_5 = parseInt('05');
    const month_6 = parseInt('06');
    const month_7 = parseInt('07');
    const month_8 = parseInt('08');
    const month_9 = parseInt('09');
    const month_10 = parseInt('10');
    const month_11 = parseInt('11');
    const month_12 = parseInt('12');

    if (year % 4 == 0) {
      if ( month == month_2 ) {
        if (date > 29) {
          return false;
        }
      }
    } else {
      if (month == month_2) {
        if (date > 28) {
          return false;
        }
      }
      if (month == month_4 || month == month_6 || month == month_9 || month == month_11) {
        if (date > 30) {
          return false;
        }
      }
      if(month == month_1 || month == month_3 || month == month_5 || month == month_7 || month == month_8 || month == month_10 || month == month_12) {
        if (date > 31) {
          return false;
        }
      }
    }

    if (month > month_12) {
      return false;
    }

    return true;
  } else {
    return false;
  }
}
