var MIN_TRUNCATE_LENGTH = 20;
var PAGE_LINE = 10;
var MAX_PAGE_BUTTON = 5;
var ACCEPT_IMAGE_TYPE = ['image/png', 'image/jpeg', 'image/gif'];
var ACCEPT_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
function PAGINATION_INFO(START, END, TOTAL) {
  return `${TOTAL} 件中 ${START} から ${END} まで表示`;
}
var labels = {
  NEXT: '次',
  PREVIOUS: '前',
  LAST: '最終',
  FIRST: '先頭'
};

var messages = {
  ECL010: 'データが選択されていません。',
  DISABLED_POPUP_INFORM: 'ポップアップの自動表示はデフォルトでブロックされています。このサイトを例外リストに追加してください。',
  ECL002: '{0}は「{1}」文字以下で入力してください。（現在「{2}」文字）',
  ECL009: '開始日に終了日以降の日付を入力して検索することはできません。',
  ECL021: 'ファイル形式が誤っています。CSVを選択してください。',
  ECL023: 'ファイルのサイズ制限10MBを超えています。',
}

/**
 * handler back/cancel/close button
 * @param {boolean} confirm show confirm dialog or not
 * @param {function} unlockApi call this unlockApi when back
 */
function back(showConfirm, unlockApi) {
  if (showConfirm && !confirm('編集中の情報が破棄されますがよろしいですか？')) {
    return;
  }
  if (typeof unlockApi === 'function') {
    unlockApi();
  }
  window.history.back();
  setTimeout(function () {
    if (confirm('当タブを閉じてよろしいでしょうか。')) {
      window.close()
    }
  }, 500);
}

function pageBack(showConfirm, returnUrl, unlockApi) {
  if (showConfirm && !confirm('入力内容は保存されません。破棄しますか？')) {
    return;
  }
  function doBack() {
    backUrl(returnUrl);
    setTimeout(function () {
      if (confirm('当タブを閉じてよろしいでしょうか。')) {
        window.close()
      }
    }, 500);
  }
  if (typeof unlockApi === 'function') {
    unlockApi()
      .done(doBack)
      .fail(function (err, statusText) {
        alert(statusText);
        console.log(err);
      });
  } else {
    doBack();
  }
}


function setSelectInput(selector, defaultIndex) {
  var selectedType = $(selector).attr('value');
  var types = $.map($(selector + ' option'), function (el) {
    return el.value;
  });
  if (types.indexOf(selectedType) < 0) {
    selectedType = types[defaultIndex || 0];
  }
  $(selector).val(selectedType);
}

function isAddForm() {
  return location.href.indexOf('add') >= 0;
}

function hasRequestQuery(fieldName) {
  return location.href.indexOf(fieldName) >= 0;
}

function showLoading() {
  $('.loading-cover').show();
  $('.loading-main').show();
}

function hideLoading() {
  $('.loading-cover').hide();
  $('.loading-main').hide();
}

function createAsyncExport(query) {
  showLoading();
  $.ajax({
    url: '/web/api/newAsyncExport',
    data: query,
    success: function () {
      setTimeout(function () {
        if (confirm('出力依頼完了です\nファイル状況確認画面へ行きますか？')) {
          location.href = '/fileStatus/'
        }
      }, 100);
    },
    error: function (err) {
      console.error(err);
      alert('エラーです。\n時間を置いて再度お試しください。')
    },
    complete: function () {
      hideLoading();
    }
  });
}

function truncate(string, length) {
  length = length || MIN_TRUNCATE_LENGTH;
  if (string !== null && string !== undefined && string.length > length) {
    return `${string.substr(0, length)}...`;
  } else {
    return string;
  }
}

function pagination(totalCount, offset, handler, isVueComponent = false) {
  var PAGING_DIVISER = 4;
  var pageLine = PAGE_LINE;
  var maxPageButton = MAX_PAGE_BUTTON;
  var clickEvent = isVueComponent ? '@click.native' : 'onclick';
  var html = '';

  if (totalCount > 0) {
    html = `<div>
  <div class="paginate-info">
  ${ totalCount == 0 ? '検索結果はありません。' :
        PAGINATION_INFO(
          (offset + 1).toString(),
          (offset + pageLine > totalCount ? totalCount : offset + pageLine).toString(),
          totalCount.toString()
        )
      }
</div>
    `;

    var breakPaging = Math.floor(totalCount / pageLine) > maxPageButton + 2;
    var breakCount = [];
    if (breakPaging) {
      breakCount.push(Math.floor((maxPageButton) / PAGING_DIVISER));
      breakCount.push(Math.floor((maxPageButton - 1) / PAGING_DIVISER));
    }
    html += `<div class="dataTables_paginate paging_simple_numbers" style="float: right"><ul class="pagination">`;
    var onclickParam = '';
    console.log(onclickParam);
    var onclick = '';
    var className = ' disabled';
    if (offset !== 0) {
      onclick = `${handler}(${0}, ${pageLine})`;
      onclickParam = JSON.stringify({pageLine,offset:0});
      className = '';
    }
    html += `<li class="paginate_button previous${className}"><a href="#" onclickParam='${onclickParam}' ${clickEvent}="${onclick}">${labels.FIRST}</a><li>`;
    onclick = '';
    if (offset !== 0) {
      onclick = `${handler}(${offset - pageLine}, ${pageLine})`;
      onclickParam = JSON.stringify({pageLine,offset:offset - pageLine});
    }
    html += `<li class="paginate_button${className}"><a href="#" onclickParam='${onclickParam}' ${clickEvent}="${onclick}">${labels.PREVIOUS} </a><li>`;
    for (var i = 0; i < totalCount; i += pageLine) {
      var ignoreCondition = (
        (
          offset > breakCount[0] * pageLine + breakCount[1] * pageLine + pageLine ||
          i >= breakCount[0] * pageLine + breakCount[1] * pageLine * 2
        ) && (
          offset + pageLine < totalCount - breakCount[0] * pageLine - breakCount[1] * pageLine - pageLine ||
          i <= totalCount - breakCount[0] * pageLine - breakCount[1] * pageLine * 2 - 1
        )
      ) && (
          (i >= breakCount[0] * pageLine && i < offset - breakCount[1] * pageLine) ||
          (i > offset + breakCount[1] * pageLine && i < totalCount - breakCount[0] * pageLine)
        );
      if (breakPaging && ignoreCondition) {
        var temp = `<li class="paginate_button disabled"><a href="#" onclick="" >...</a></li>`;
        if (html.slice(html.length - temp.length, html.length) !== temp) { // 追加したかどうか確認する
          html += temp;
        }
      } else {
        if (i === offset) {
          html += `
            <li class="paginate_button active"><a href="#" onclick="">${ i / pageLine + 1}</a></li>
          `;
        } else {
          onclickParam = JSON.stringify({pageLine,offset:i});
          html += `
            <li class="paginate_button"><a href="#" onclickParam='${onclickParam}' ${clickEvent}="${handler}(${i}, ${pageLine})">${i / pageLine + 1}</a></li>
          `;
        }
      }
    }
    onclick = '';
    className = ' disabled';
    if (offset + pageLine < totalCount) {
      onclick = `${handler}(${offset + pageLine}, ${pageLine})`;
      onclickParam = JSON.stringify({pageLine,offset:offset + pageLine});
      className = '';
    }
    html += `<li class="paginate_button${className}"><a href="#" onclickParam='${onclickParam}' ${clickEvent}="${onclick}">${labels.NEXT}</a></li>`;
    onclick = '';
    if (offset + pageLine < totalCount) {
      onclick = `${handler}(${Math.floor((totalCount - 1) / pageLine) * pageLine}, ${pageLine})`;
      onclickParam = JSON.stringify({pageLine,offset:Math.floor((totalCount - 1) / pageLine) * pageLine});
    }
    html += `<li class="paginate_button${className}"><a href="#" onclickParam='${onclickParam}' ${clickEvent}="${onclick}">${labels.LAST}</a></li>`;
    html += `</ul></div></div>`;
  }
  else {
    html = `
        <div class="paginate-info">
          検索結果はありません。
        </div>
      `;
  }
  return html;
}

function showPopupHandler(event) {
  var target = $(this).data('target');
  if (target === undefined) {
    target = $(event.target).data('target');
  }
  if (target === undefined) {
    // handle case when user click on icon inside button
    target = $(event.target).parent().data('target');
  }
  var btnReset = $(target).find('button.btn-reset').eq(0);
  var btnSearch = $(target).find('button.btn-search').eq(0);
  $(btnReset).click();
  // reset data table
  setTimeout(function () {
    $(btnSearch).click();
  })

  // scroll to top
  $(target).find('div.table-container>.col').hide();
  $(document).ajaxStop(function () {
    // $(target).find('div.modal-content').scrollTop(0)
    $(target).find('div.table-container>.col').show();
    $(target).find('.table-responsive').scrollLeft(0);
  });
}

// 検索画面用、ページングあり
$(document).ready(function () {
  try {
    // set companyLst
    $.fn.common.companyLst = JSON.parse($('input[name="companyLst"').val()) || [];
    $.fn.common.companyLst = $.fn.common.companyLst.map(e => e.key.toString());
  } catch(err) {}

  // set datepicker
  $.fn.common.setDatePicker($('#calendar_right'));
  
  // reset modal when reopen
  $('body').delegate('button[data-toggle="modal"]', 'click', function (event) {
    showPopupHandler(event);
  });

  $('.pageLimitSetting select').change(function (event) {
    var href = $(this).data('href') + '&pageLine=' + $(this).val();
    window.location.href = href;
  });

    $('.btn-delete-many').off('click').on('click', function () {
    if (confirm('削除してよろしいですか。')) {
      var apiReqs = [];
      $('.check-delete[type="checkbox"]:checked').each(function(e) {
        apiReqs.push(
          axios
          .delete(`/web/api/${$(this).data('type')}`, 
          {data: { id: $(this).data('id') },
          headers: {'X-Requested-With': 'XMLHttpRequest'},
        })
        );
      });

      if (apiReqs.length === 0) {
        return;
      }

      axios
      .all(apiReqs)
      .then(axios.spread((...responses) => {
        var failReponses = [];

        failReponses = responses.filter(r => r.data.status != 'success');

        // If success all, then alert message and reload page
        if (failReponses.length === 0) {
          alert('削除処理が完了しました。');
          window.location.href = URI(window.location.href).removeSearch('offset').removeSearch('pageLine').toString();    
        } else {

          // If any of the apis failed, then display error messages
          failReponses = failReponses.map(function(r) { 
            return `id ${r.data.id} の削除に失敗しました`
          });

          $('#error-message').html('');

          $('#error-message').html(`<div class="alert alert-danger alert-dismissible">
            <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
            ${failReponses.join('<br>')}
          </div>`);

          window.scrollTo(0, 0);
        } 
      })).catch(error => {
        $.fn.common.commonAjaxErrorHandler(error.response);
        // if (!error.response) {
        //   alert(`TimeOut しています。再度ログイン後実行してください。`);
        //   // open login popup
        //   openLoginPopup();
        // } else {
        //   $.fn.common.commonAjaxErrorHandler(error.response);
        // }
      })
    }
  });

  $(window).bind("pageshow", function () {
    var form = $('form');
    if (form.length > 0) {
      form[0].reset();
    }
  });

});

var popupBlockerChecker = {
  check: function (popup_window) {
    var scope = this;
    if (popup_window) {
      if (/chrome/.test(navigator.userAgent.toLowerCase())) {
        setTimeout(function () {
          scope.is_popup_blocked(scope, popup_window);
        }, 200);
      } else {
        popup_window.onload = function () {
          scope.is_popup_blocked(scope, popup_window);
        };
      }
    } else {
      return false;
    }

    return true;
  },
  is_popup_blocked: function (scope, popup_window) {
    if ((popup_window.innerHeight > 0) == false) {
      return false;
    }
  }
};

function hideDataTable(modal) {
  modal.find('.paginate-container>div').html(pagination(0, -1, ''));
  var table = modal.find('.table-container:eq(0) table tbody, .paginate-container:eq(0)>.col>.btn-group');
  table.hide();
}

function jsUcfirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

//  キャンセル click event
function eventBack(returnUrl) {
  var formChanged = false;
  $("form input:visible, form select:visible").each(function (input) {
    debugger
    var name = $(this).attr("name");
    var hdn = $("input[name='" + "hdn" + jsUcfirst(name) + "']:hidden, select[name='" + "hdn" + jsUcfirst(name) + "']:hidden").val();

    if (hdn === undefined || hdn == 'undefined') { hdn = ''; };
    if (hdn != $(this).val()) {
      formChanged = true;
      return;
    }
  });

  if (formChanged) {
    pageBack(true, returnUrl);
  } else {
    backUrl(returnUrl);
  }
}

/**
 * a function to delay calling alert
 * @param {String} message message to be displayed
 * @param {number} timeout delay time
 */
function delayAlert(message, timeout = 100) {
  setTimeout(function() {
    alert(message);
  }, timeout);
}

//　function to open new login windows when token is expired
function openLoginPopup() {
  var redirect = window.location.pathname + window.location.search;
  window.location.href = `/login?redirect=${URI.encode(redirect)}`;
}

$(document).ajaxError(function (e, jqXHR, ajaxSettings, thrownError) {
  console.log(e);
  if (jqXHR.status == '401') {
    alert(`TimeOut しています。再度ログイン後実行してください。`);
    openLoginPopup();
  }
  // else {
  //   alert('エラーが発生です。\n' + jqXHR.statusText + ' (code: ' + jqXHR.status + ')');
  // }
});


jQuery.fn.extend({
  common: {
    companyLst: [],
    SAVE_LEAVE: false,
    /**
     * function to setup confirm dialog on add/edit form
     * when click on back button of browser, or change url in address box of browser -> show default dialog
     */
    setupOnLeaveEvent: function(form) {
      // save original form value, to check with form value when user leave page
      form.data('originalValue', form.serialize());

      // setup default, native browser dialog
      $(window).on('beforeunload', function(e) {
        if (!$.fn.common.SAFE_LEAVE && form.data('originalValue') !== form.serialize()) {
          return e.originalEvent.returnValue = '入力内容は破棄されますがよろしいですか。'; // show confirm dialog
        } // else do nothing, process with normal operation
      });
    },
    commonAjaxErrorHandler: function(err, defaultError) {
      console.log(err);
      try {
        if (err.status === 408) {
          alert('TimeOut しています');
        } else if (err.status === 401) { // Unauthorized
          alert(`TimeOut しています。再度ログイン後実行してください。`);
          // open login popup
          openLoginPopup();
        } else {
          if (err.responseJSON) {
            alert(err.responseJSON.message);
          } else {
            alert('エラーが発生です。\n' + err.statusText + ' (code: ' + err.status + ')');
          }
        }
      } catch (err) {
        console.log(err);
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
    convertToCharTwoByte: function(input) {
      input = input.replace( /[｡｢｣､･ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝﾞﾟ]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) + 0xCE65);
      });
      return input;
    },
    convertToCharOneByte: function(input) {
      input = input.replace( /[ァ-ン]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 65248);
      });
      return input;
    },
    toASCII : function (chars) {
      var ascii = '';
      for(var i=0, l=chars.length; i<l; i++) {
          var c = chars[i].charCodeAt(0);

          // make sure we only convert half-full width char
          if (c >= 0x30A0 && c <= 0x30FF) {
              c = 0xFF & (c + 0x20);
          }

          ascii += String.fromCharCode(c);
      }

      return ascii;
    },
    showLoading: function() {
      $("#loader").show();
    },
    hideLoading: function() {
      $("#loader").hide();
    },
    timer: function(downloadToken) {
      var attempts = 30;    // wait for maximum 20 seconds
      var downloadTimer = window.setInterval(function () {
        var token = $.fn.common.getCookie("downloadToken");
        attempts--;

        if (token == downloadToken || attempts == 0) {
          $.fn.common.hideLoading();
          window.clearInterval(downloadTimer);
        }
        else {
        }
      }, 1000);
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
