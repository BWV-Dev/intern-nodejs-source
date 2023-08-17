(function (factory) {
	if (typeof define === "function" && define.amd) {
		define(["jquery", "../jquery.validate"], factory);
	} else if (typeof module === "object" && module.exports) {
		module.exports = factory(require("jquery"));
	} else {
		factory(jQuery);
	}
}(function ($) {
	// 必須(V001)
	var V001 = 'は必須項目です。';
	var V004 = 'は半角数字で入力してください。';
	var V006 = 'は半角英数で入力してください。';
	var V010 = 'は日付を正しく入力してください。';
	var ECL009 = 'は半角数字で入力してください。';
	var V028 = 'では半角英字および以下の文字以外はご使用いただけません。(「@」、「!」、「"」、「#」、「$」、「%」、「&」、「\'」、「(」、「)」、' +
    '「*」、「+」、「,」、「-」、「.」、「/」、「:」、「;」、「<」、「>」、「=」、「?」、「[」、「]」、「\\」、「^」、「_」、「{」、「}」、「|」、「~」)';
	var V031 = 'パスワードと確認用パスワードが一致しません。';
	var V034 = 'に不正な値が入力または選択されています。';

	/*
	 * Translated default messages for the jQuery validation plugin.
	 * Locale: JA (Japanese; 日本語)
	 */
	$.extend($.validator.messages, {
		required: function (param) {
			return param.name + V001;
		},
		maxlength: function (param, input) {
			return $(input).data('name') + "は「" + $(input).data('maxlength') + "」文字以下で入力してください。（現在「" +  $(input).val().length + "」文字)";  
		},
		maxlengthwithcomma: function (param, input) {
			return $(input).data('name') + "は「" + $(input).data('maxlength') + "」文字以下で入力してください。（現在「" +  $(input).val().replace(/,/g, "").length + "」文字)";
		},
		minlength: function(param, input) {
			return $(input).data('name') + "は「" + $(input).data('minlength') + "」文字以上で入力してください。（現在「" + $(input).val().length + "」文字)";
		},
		digits: function (param, input) {
			return $(input).data('name') + ECL009;
		},
		checkCharOneByte: function (param, input) {
			return $(input).data('name') + V006;
		},
		checkNumberOneByte: function (param, input) {
			return $(input).data('name') + V004;
		},
		checkNumberOneByteCustomComma: function (param, input) {
			return $(input).data('name') + V004;
		},
		checkPassword: function (param, input) {
			return $(input).data('name') + V028;
		},
		fixedlength: function(param, input) {
			return $(input).data('name') + "は「" + $(input).data('length') + "」文字で入力してください。（現在「" + $(input).val().length + "」文字)";
		},
		isValidDecimalRangeMoisturizing: function (param, input) {
			return $(input).data('name') + "は整数部分「" + $(input).data('maxlengthint') + "」文字, 小数部分「" +$(input).data('maxlengthfloat')+ "」文字以下で入力してください。";
		},

		checkRegexCharByte: function(param, input) {
			return $(input).data('name') + 'では半角英数字および以下の文字以外はご使用いただけません。 (「#」、「$」、「%」、「(」、「) 」、「*」、「+」、「-」、「.」、「/」、「:」、「;」、「?」、「@」、「[」、「]」、「_ 」、「{」、「}」、「~」)';
		},
		isValidDecimalRange: function (param, input) {
			return $(input).data('name') + "は整数部分「" + $(input).data('maxlength1') + "」文字, 小数部分「" +$(input).data('maxlength2')+ "」文字以下で入力してください。";
		},

		checkRegexKataKana: function(param, input) {
			return $(input).data('name') + 'はカタカナで入力してください。';
		},

		checkUrl: function(param, input) {
			return $(input).data('name') + 'はURLを正しく入力してください。';
		},

		remote: "このフィールドを修正してください。",
		email: "メールアドレスを正しく入力してください。",
		url: "有効なURLを入力してください。",
		date: function (param) {
			return param.name + V010;
		},
		dateISO: "有効な日付（ISO）を入力してください。",
		number: "有効な数字を入力してください。",
		creditcard: "有効なクレジットカード番号を入力してください。",
		equalTo: "同じ値をもう一度入力してください。",
		extension: "有効な拡張子を含む値を入力してください。",
		rangelength: $.validator.format("{0} 文字から {1} 文字までの値を入力してください。"),
		range: $.validator.format("{0} から {1} までの値を入力してください。"),
		step: $.validator.format("{0} の倍数を入力してください。"),
		max: $.validator.format("{0} 以下の値を入力してください。"),
		min: $.validator.format("{0} 以上の値を入力してください。"),
		checkRegexKatakana2byte: function(param, input) {
			return $(input).data('name') + 'はカタカナで入力してください。';
		},
		inSelectedList: function(param) {
			return param.name + V034;
		}
	});
	return $;
}));