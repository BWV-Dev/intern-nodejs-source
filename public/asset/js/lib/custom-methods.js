$.validator.addMethod('hiragana', function (value) {
  return !(/[^ぁ-ゔゞ゛゜ー]/.test(value));
}, 'ひらがなのみを入力してください。');

$.validator.addMethod('zipcode', function (value, element) {
  return this.optional(element) || /^\d{3}(?:-\d{4})?$/.test(value);
}, '有効な郵便番号を入力してください。');

$.validator.addMethod('checkId', function (_, __, selector) {
  return $(selector).val() !== '';
});

$.validator.addMethod(
  "checkCharOneByte",
  function(value, element) {
      return this.optional(element) || /^[a-zA-Z0-9!-/:-@\\[-`{-~ ]+$/.test(value);
  }
);

$.validator.addMethod(
  "checkUrl",
  function(value, element) {
      return this.optional(element) || /(^(http|https):\/\/)/.test(value);
  }
);

$.validator.addMethod(
  "checkNumberOneByte",
  function(value, element) {
      return this.optional(element) || /^[0-9]+$/.test(value);
  }
);

$.validator.addMethod(
  "checkNumberOneByteCustomComma",
  function(value, element) {
      return this.optional(element) || /^[0-9,]+$/.test(value);
  }
);

$.validator.addMethod("checkPassword", function(value, element) {
  return this.optional(element) || /^[a-zA-Z0-9 ~`!@#$%^&*()-_=+<>?,./:;"'{}|]*$/.test(value);
});

$.validator.addMethod(
  "isValidDecimalRangeMoisturizing",
  function(value, element) {
      return this.optional(element) || /^[\d]{1,1}(\.[\d]{1,3})?$/.test(value);
  }
);

$.validator.addMethod(
  "checkRegexEmail",
  function(value, element) {
    var regex = /^(([a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*))@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return this.optional(element) || regex.test(value);
}, 'メールアドレスを正しく入力してください。');


$.validator.addMethod(
  "checkRegexCharByte",
  function(value, element) {
    var regex = /^[a-zA-Z0-9#\$\%()\*\+\-\.\/:;?@[\]_{}~]+$/;
    return this.optional(element) || regex.test(value);
});

$.validator.addMethod(
  "isValidDecimalRange",
  function(value, element) {
      return this.optional(element) || /^[\d]{1,1}(\.[\d]{1,2})?$/.test(value);
  }
);

$.validator.addMethod(
  "checkRegexKataKana",
  function(value, element) {
      return this.optional(element) || /^[ｦ-ﾝﾞﾟァ-ヶー]+$/.test(value);
  }
);

$.validator.addMethod('cMaxLength', function( value, element, param ) {
  var length = $.isArray( value ) ? value.length : this.getLength( value, element );
  var elRules = $(element).rules();
  if (elRules.minusDigits !== undefined) {
    return (value.indexOf('-') === 0) ? this.optional(element) || length <= param[0] + 1 : this.optional(element) || length <= param[0];
  } else {
    return this.optional(element) || length <= param[0];
  }
}, $.validator.format('{1}は{0}文字以内で入力してください'));

$.validator.addMethod('fixedlength', function( value, element, param ) {
  var length = value.length;
  return this.optional(element) || length == param[0];
});

jQuery.validator.addMethod("greaterThanOrEqual", function(value, element, params) {
    if (!/Invalid|NaN/.test(new Date(value)) && !/Invalid|NaN/.test(new Date($(params).val()))) {
        return new Date(value) >= new Date($(params).val());
    }
    return true;
});

$.validator.addMethod('cDate', function (value) {
  return isValidDate(value); 
}, $.validator.format('{0}は日付を正しく入力してください。'));

function isValidDate(dateString) {
  if(dateString.length == 0) return true;
  var regEx01 = /^\d{4}-\d{2}-\d{2}$/;
  var regEx02 = /^\d{4}\/\d{2}\/\d{2}$/;
  if(!dateString.match(regEx01) && !dateString.match(regEx02)) return false;  // Invalid format
  var d = new Date(dateString);
  var dNum = d.getTime();
  if(!dNum && dNum !== 0) return false; // NaN value, Invalid date
  return true;
}
$.validator.addMethod('maxlengthwithcomma', function( value, element, param ) {
  var length = value.length;
  return this.optional(element) || length <= param[0];
});

/**
 * katakana 2 byte
 * allow 2byte katakana, 1 byte katakana, symbol, space
 */
$.validator.addMethod(
  "checkRegexKatakana2byte",
  function(value, element) {
      return this.optional(element) || /^[ァ-ヶｦ-ﾟ!-/:-@¥[-`{-~ー　 ]+$/.test(value);
  }
);

/**
 * Check if selected value in valid range
 */
$.validator.addMethod("inSelectedList", function( value, element, param ) {
  var valueLst = param.list;
  return $.inArray(value ? value.toUpperCase() : '', valueLst) != -1;
});

$.validator.addMethod("checkRegexPhone", function(value, element) {
  return this.optional(element) || /^[0-9-ー０-９+＋‐ー]*$/.test(value);
});

