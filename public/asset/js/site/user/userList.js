import {messages, regexList} from '../constants.js';
import {
  showLoading,
  hideLoading,
  disabledButton,
  enableButton,
  escape,
  checkMaxLength,
  checkDateMonthYearFrom,
  checkDateMonthYearTo,
  checkDateFormat,
} from './common.js';

// add method check max length for user name
checkMaxLength('checkNameMaxLength100', 100, 'User Name', 'input#name');
checkDateFormat('validateDateFormatDateFrom', 'Entered Date From');
checkDateFormat('validateDateFormatDateTo', 'Entered Date To');

// add method check entered date from - to
$.validator.addMethod('greaterThan', function(value, element) {
  let dateFrom = $('#enteredDateFrom').val();
  let dateTo = $('#enteredDateTo').val();
  if (!dateFrom || !dateTo) return true;

  if (
    !regexList.DATE_YYYYMMDD.test(dateFrom) ||
    !regexList.DATE_YYYYMMDD.test(dateTo)
  ) {
    return true;
  }

  if (dateFrom) {
    if (!checkDateMonthYearFrom(dateFrom) || !checkDateMonthYearTo(dateTo)) {
      return true;
    }
  }

  return dateTo >= dateFrom;
});

$(document).ready(function() {
  let t;
  // init position data
  const positionData = [
    {
      id: 0,
      text: 'ADMIN',
    },
    {
      id: 1,
      text: 'MANAGER',
    },
    {
      id: 2,
      text: 'USER',
    },
  ];

  // add select2 for position select
  $('#position').select2({
    data: positionData,
    minimumResultsForSearch: Infinity,
  });

  // datepicker
  $('#enteredDateFrom').datepicker({
    dateFormat: 'yy/mm/dd',
    changeMonth: true,
    changeYear: true,
  });

  $('#enteredDateTo').datepicker({
    dateFormat: 'yy/mm/dd',
    changeMonth: true,
    changeYear: true,
  });

  // validate search form
  $('#searchForm').validate({
    rules: {
      name: {
        checkNameMaxLength100: true,
      },
      enteredDateFrom: {
        validateDateFormatDateFrom: true,
      },
      enteredDateTo: {
        greaterThan: true,
        validateDateFormatDateTo: true,
      },
    },
    messages: {
      enteredDateTo: {
        greaterThan: function() {
          $('#enteredDateTo').attr('data-id', 'greaterThan');
        },
      },
    },
    errorPlacement: function(error, element) {
      const placement = $(element).data('error');
      placement ? $(placement).append(error) : error.insertAfter(element);
    },
    highlight: function(element) {
      if (element.id == 'name') {
        $('div#nameMsg').css('display', 'block');
        $('i#errorNameValidateIcon').css('display', 'block');
      }

      if (element.id == 'enteredDateFrom') {
        $('div#enteredDateFromMsg').css('display', 'block');
        $('i#errorDateFromValidateIcon').css('display', 'block');
      }

      if (element.id == 'enteredDateTo') {
        if ($('#enteredDateTo').attr('data-id') != 'greaterThan') {
          $('div#enteredDateToMsg').css('display', 'block');
          $('i#errorDateToValidateIcon').css('display', 'block');
          $('#enteredDateGreaterThanMsg').css('display', 'none');
          $('#enteredDateGreaterThanMsg').html('');
        } else {
          $('div#enteredDateToMsg').css('display', 'none');
          $('i#errorDateToValidateIcon').css('display', 'none');
          $('#enteredDateGreaterThanMsg').css('display', 'block');
          $('#enteredDateGreaterThanMsg').html(`
              <p id="enteredDateGreaterThan-error" class="error">${messages.ECL069(
                'Entered Date From',
                'Entered Date To',
              )}</p>`);
          $('i#errorDateFrom2ValidateIcon').css('display', 'block');
          $('i#errorDateToValidateIcon').css('display', 'block');
        }
      }
    },
    unhighlight: function(element) {
      if (element.id == 'name') {
        $('div#nameMsg').css('display', 'none');
        $('i#errorNameValidateIcon').css('display', 'none');
      }

      if (element.id == 'enteredDateFrom') {
        $('div#enteredDateFromMsg').css('display', 'none');
        $('i#errorDateFromValidateIcon').css('display', 'none');
      }

      if (element.id == 'enteredDateTo') {
        if ($('#enteredDateTo').attr('data-id') != 'greaterThan') {
          $('div#enteredDateToMsg').css('display', 'none');
          $('i#errorDateToValidateIcon').css('display', 'none');
          $('#enteredDateGreaterThanMsg').css('display', 'none');
          $('#enteredDateGreaterThanMsg').html('');
          $('i#errorDateFrom2ValidateIcon').css('display', 'none');
          $('i#errorDateToValidateIcon').css('display', 'none');
          $('#enteredDateTo').removeAttr('data-id');
        } else {
          $('#enteredDateGreaterThanMsg').css('display', 'none');
          $('#enteredDateGreaterThanMsg').html('');
          // $('i#errorDateFromValidateIcon').css('display', 'none');
          $('i#errorDateFrom2ValidateIcon').css('display', 'none');
          $('i#errorDateToValidateIcon').css('display', 'none');
          $('#enteredDateTo').removeAttr('data-id');
        }
      }
    },
  });

  // change user name input -> validate
  $('input#name').on('input', function() {
    // validate password length
    checkMaxLength('checkNameMaxLength100', 100, 'User Name', 'input#name');
    $('input#name').valid();
  });

  // input on change -> form validation
  $('input#enteredDateFrom').on('change', () => {
    // method for created date from - to
    $('#enteredDateTo').removeAttr('data-id');
    checkDateFormat('validateDateFormatDateFrom', 'Entered Date From');

    $.validator.addMethod('greaterThan', function(value, element) {
      let dateFrom = $('#enteredDateFrom').val();
      let dateTo = $('#enteredDateTo').val();
      if (!dateFrom || !dateTo) return true;

      if (!regexList.DATE_YYYYMMDD.test(dateFrom)) {
        return true;
      }
      if (!regexList.DATE_YYYYMMDD.test(dateTo)) {
        return true;
      }

      if (dateFrom) {
        if (!checkDateMonthYearFrom(dateFrom)) {
          return true;
        }
      }

      if (dateTo) {
        if (!checkDateMonthYearTo(dateTo)) {
          return true;
        }
      }

      return dateTo >= dateFrom;
    });
    $('#enteredDateFrom').valid();
    $('#enteredDateTo').valid();
  });

  $('input#enteredDateFrom').on('input', () => {
    $('#enteredDateFrom').valid();
    $('#enteredDateTo').valid();
  });

  $('input#enteredDateTo').on('input', () => {
    $('#enteredDateFrom').valid();
    $('#enteredDateTo').valid();
  });

  // handle when entered date to change
  $('input#enteredDateTo').on('change', () => {
    // method for created date from - to
    checkDateFormat('validateDateFormatDateTo', 'Entered Date To');
    $('#enteredDateTo').removeAttr('data-id');
    $('#errorDateFrom2ValidateIcon').css('display', 'none');

    $.validator.addMethod('greaterThan', function(value, element) {
      let dateFrom = $('#enteredDateFrom').val();
      let dateTo = $('#enteredDateTo').val();
      if (!dateFrom || !dateTo) return true;

      if (!regexList.DATE_YYYYMMDD.test(dateFrom)) {
        return true;
      }
      if (!regexList.DATE_YYYYMMDD.test(dateTo)) {
        return true;
      }

      if (dateFrom) {
        if (!checkDateMonthYearFrom(dateFrom)) {
          return true;
        }
      }

      if (dateTo) {
        if (!checkDateMonthYearTo(dateTo)) {
          return true;
        }
      }

      return dateTo >= dateFrom;
    });
    $('#enteredDateFrom').valid();
    $('#enteredDateTo').valid();
  });

  $('input#enteredDateTo').on('focusout', () => {
    $('#enteredDateTo').valid();
  });

  // setup datatables function
  function datatables(name, position, enteredDateFrom, enteredDateTo) {
    t = $('#userTable').DataTable({
      bFilter: false,
      processing: true,
      serverSide: true,
      destroy: true,
      ordering: false,
      info: false,
      pagingType: 'full_numbers',
      bLengthChange: false,
      language: {
        paginate: {
          first: '<span>最初</span>',
          previous: '<span>前へ</span>',
          next: '<span>次へ</span>',
          last: '<span>最終</span>',
        },
        emptyTable: 'No Record',
      },
      ajax: {
        data: {
          name,
          position,
          enteredDateFrom,
          enteredDateTo,
        },
        type: 'GET',
        url: '/user/search',
        dataType: 'json',
        error: function(xhr, resp, text) {
          disabledButton('#searchBtn');
          alert(xhr.responseJSON);
        },
      },
      columnDefs: [
        {
          className: 'userlist__name',
          targets: 0,
        },
        {
          className: 'userlist__email',
          targets: 1,
        },
        {
          className: 'userlist__role',
          targets: 2,
        },
        {
          className: 'userlist__createdAt',
          targets: 3,
        },
      ],
      columns: [
        {
          data: null,
          render: function(data) {
            if ($('#positionIdLoginUser').val() == 0) {
              return `<a href="#">${escape(
                data.name,
              )}</a>`;
            } else {
              return escape(data.name);
            }
          },
        },
        {
          data: 'email',
          render: function(data) {
            return escape(data);
          },
        },
        {
          data: 'role',
          render: function(data) {
            switch (data) {
              case 0:
                return 'ADMIN';
              case 1:
                return 'MANAGER';
              case 2:
                return 'USER';

              default:
                return '';
            }
          },
        },
        {data: 'createdAt'},
      ],
    });
  }

  // ajax datatables successfully
  $('#userTable').on('xhr.dt', function(e, settings, json, xhr) {
    enableButton('#searchBtn');
    const rowsTotal = t.ajax.json().recordsTotal;

    rowsTotal > 10
      ? $('#userTable_paginate').removeClass('d-none')
      : $('#userTable_paginate').addClass('d-none');

    rowsTotal > 0
      ? $('#outputCSVButton, #outputPDFButton, #outputExcelButton').removeClass(
          'd-none',
        )
      : $('#outputCSVButton, #outputPDFButton, #outputExcelButton').addClass(
          'd-none',
        );
  });

  // search btn
  $('#searchBtn').on('click', function(e) {
    e.preventDefault();
    $('#userTable')
      .dataTable()
      .fnDestroy();
    $('#userTable tbody').html('');
    $('#userTableContainer').addClass('d-none');
    $('#outputCSVButton, #outputPDFButton, #outputExcelButton').addClass(
      'd-none',
    );
    $('form#searchForm').valid();

    const name = $('#name').val();
    const position = $('#position').val();
    const enteredDateFrom = $('#enteredDateFrom').val();
    const enteredDateTo = $('#enteredDateTo').val();

    if ($('#searchForm').valid()) {
      disabledButton('#searchBtn');
      $('#showTableHeader').removeClass('d-none');
      $('#userTableContainer').removeClass('d-none');
      datatables(name, position, enteredDateFrom, enteredDateTo);
    }
  });

  // reset btn
  $('#resetSearchBtn').on('click', function(e) {
    e.preventDefault();
    $('#name').val('');
    $('#position')
      .val('')
      .trigger('change');
    $('#enteredDateFrom').datepicker('setDate', null);
    $('#enteredDateTo').datepicker('setDate', null);
    $('#enteredDateTo').removeAttr('data-id');
    $('#enteredDateGreaterThanMsg').css('display', 'none');
    $('#userTable')
      .dataTable()
      .fnDestroy();
    $('#userTable tbody').html('');
    $('#userTableContainer').addClass('d-none');
    $('#outputCSVButton, #outputPDFButton, #outputExcelButton').addClass(
      'd-none',
    );
    $('#position').val(null);

    $('form#searchForm').valid();
  });

  $('#name, #enteredDateFrom, #enteredDateTo').on('keyup', function(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      $('#searchBtn').click();
    }
  });

  if ($('#positionIdLoginUser').val() != 0) {
    $('#userTableContainer').addClass('d-none');
    $('#userListNavBottom').addClass('d-none');
  }

  // add new btn
  $(document).on('click', '#addNewBtn', function() {
    window.location.href = '/user/add';
  });

  // export csv
  $('#outputCSVButton').on('click', function(e) {
    e.preventDefault();
    showLoading();
    const params = t.ajax.params();

    const name = params?.name || '';
    const enteredDateFrom = params?.enteredDateFrom || '';
    const enteredDateTo = params?.enteredDateTo || '';

    $.ajax({
      url: '/user/output-csv',
      data: {
        name,
        enteredDateFrom,
        enteredDateTo,
      },
      type: 'GET',
      success: function(result) {
        hideLoading();
        $('#modal-export').modal('show');
        if (result === 'Null') {
          $('#export-heading').html('Data Null');
          $('.modal-body #modal-export-text').html('Data Null');
          $('#download-records').addClass('d-none');
        } else {
          $('.modal-body #modal-export-text').html(
            `Export success ${t.page.info().recordsTotal} records!`,
          );

          console.log(result);
          const blob = new Blob([result], {type: 'text/csv'});
          const downloadUrl = URL.createObjectURL(blob);
          const a = $('#download-records');

          // get now timestamp and convert to yyyymmddhhmmss format
          let date = new Date();
          date.getFullYear() +
            ('0' + (date.getMonth() + 1)).slice(-2) +
            ('0' + date.getDate()).slice(-2) +
            ('0' + date.getHours()).slice(-2) +
            ('0' + date.getMinutes()).slice(-2) +
            ('0' + date.getSeconds()).slice(-2);

          let csvFileName =
            'list_user_' +
            date.getFullYear() +
            ('0' + (date.getMonth() + 1)).slice(-2) +
            ('0' + date.getDate()).slice(-2) +
            ('0' + date.getHours()).slice(-2) +
            ('0' + date.getMinutes()).slice(-2) +
            ('0' + date.getSeconds()).slice(-2);

          a.attr('href', downloadUrl);
          a.attr('download', csvFileName);
        }
      },
      error: function(e) {
        hideLoading();
        $('#modal-export').modal('show');
        $('.modal-body #modal-export-text').html('Export failed!');
        $('#download-records').addClass('d-none');
      },
    });
  });

  // export PDF
  $('#outputPDFButton').on('click', function(e) {
    e.preventDefault();
    showLoading();
    const params = t.ajax.params();

    const name = params?.name || '';
    const enteredDateFrom = params?.enteredDateFrom || '';
    const enteredDateTo = params?.enteredDateTo || '';

    $.ajax({
      url: '/user/output-pdf',
      data: {
        name,
        enteredDateFrom,
        enteredDateTo,
      },
      type: 'GET',
      success: function(result) {
        hideLoading();
        $('#modal-export').modal('show');
        if (result === 'Null') {
          $('#export-heading').html('Data Null');
          $('.modal-body #modal-export-text').html('Data Null');
          $('#download-records').addClass('d-none');
        } else {
          $('.modal-body #modal-export-text').html(
            `Export success ${t.page.info().recordsTotal} records!`,
          );
          const blob = new Blob([result], {type: 'application/pdf'});
          const downloadUrl = URL.createObjectURL(blob);
          const a = $('#download-records');

          // get now timestamp and convert to yyyymmddhhmmss format
          let date = new Date();
          date.getFullYear() +
            ('0' + (date.getMonth() + 1)).slice(-2) +
            ('0' + date.getDate()).slice(-2) +
            ('0' + date.getHours()).slice(-2) +
            ('0' + date.getMinutes()).slice(-2) +
            ('0' + date.getSeconds()).slice(-2);

          let csvFileName =
            'list_user_' +
            date.getFullYear() +
            ('0' + (date.getMonth() + 1)).slice(-2) +
            ('0' + date.getDate()).slice(-2) +
            ('0' + date.getHours()).slice(-2) +
            ('0' + date.getMinutes()).slice(-2) +
            ('0' + date.getSeconds()).slice(-2);

          a.attr('href', downloadUrl);
          a.attr('download', csvFileName);
        }
      },
      error: function(e) {
        hideLoading();
        $('#modal-export').modal('show');
        $('.modal-body #modal-export-text').html('Export failed!');
        $('#download-records').addClass('d-none');
      },
    });
  });

  // export Excel
  $('#outputExcelButton').on('click', function(e) {
    e.preventDefault();
    showLoading();
    const params = t.ajax.params();

    const name = params?.name || '';
    const enteredDateFrom = params?.enteredDateFrom || '';
    const enteredDateTo = params?.enteredDateTo || '';

    $.ajax({
      url: '/user/output-excel',
      data: {
        name,
        enteredDateFrom,
        enteredDateTo,
      },
      type: 'GET',
      xhrFields: {
        responseType: 'blob',
      },
      success: function(result) {
        hideLoading();
        $('#modal-export').modal('show');
        if (result === 'Null') {
          $('#export-heading').html('Data Null');
          $('.modal-body #modal-export-text').html('Data Null');
          $('#download-records').addClass('d-none');
        } else {
          $('.modal-body #modal-export-text').html(
            `Export success ${t.page.info().recordsTotal} records!`,
          );
          const blob = new Blob([result], {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          const downloadUrl = URL.createObjectURL(blob);
          const a = $('#download-records');

          // get now timestamp and convert to yyyymmddhhmmss format
          let date = new Date();
          date.getFullYear() +
            ('0' + (date.getMonth() + 1)).slice(-2) +
            ('0' + date.getDate()).slice(-2) +
            ('0' + date.getHours()).slice(-2) +
            ('0' + date.getMinutes()).slice(-2) +
            ('0' + date.getSeconds()).slice(-2);

          let xlsxFileName =
            'list_user_' +
            date.getFullYear() +
            ('0' + (date.getMonth() + 1)).slice(-2) +
            ('0' + date.getDate()).slice(-2) +
            ('0' + date.getHours()).slice(-2) +
            ('0' + date.getMinutes()).slice(-2) +
            ('0' + date.getSeconds()).slice(-2);

          a.attr('href', downloadUrl);
          a.attr('download', xlsxFileName);
        }
      },
      error: function(e) {
        hideLoading();
        $('#modal-export').modal('show');
        $('.modal-body #modal-export-text').html('Export failed!');
        $('#download-records').addClass('d-none');
      },
    });
  });
});
