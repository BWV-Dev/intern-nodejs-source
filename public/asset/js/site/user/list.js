$(function() {
  $(window).on('pageshow', function() {
    checkLoginStatus();
  });

  $(document).ready(function() {
    checkLoginStatus();
    formValidation();
  });

  $.validator.addMethod('validDate', function(value) {
    if (value == '') {
      return true;
    }
    return moment(value, 'DD/MM/YYYY', true).isValid();
  });

  $.validator.addMethod('validFromTo', function(value) {
    if (
      moment($('#startedDateTo').val(), 'DD/MM/YYYY', true).isValid() &&
      moment($('#startedDateFrom').val(), 'DD/MM/YYYY', true).isValid()
    ) {
      const dateTo = moment($('#startedDateTo').val(), 'DD/MM/YYYY');
      const dateFrom = moment($('#startedDateFrom').val(), 'DD/MM/YYYY');

      return moment(dateFrom).isSameOrBefore(dateTo, 'day');
    }
    return true;
  });

  /**
   * Form validation
   */
  function formValidation() {
    // Form Validation
    $('#searchFrm').validate({
      lang: 'ja',
      errorElement: 'span',
      errorClass: 'mf-5 text-danger align-middle d-block',
      onkeyup: function(element) {
        $(element).valid();
      },
      onblur: function(element) {
        $(element).valid();
      },
      rules: {
        username: {
          maxlength: 100,
        },
        startedDateFrom: {
          validDate: true,
        },
        startedDateTo: {
          validDate: true,
          validFromTo: true,
        },
      },
      messages: {
        username: {
          maxlength: function(meta, element) {
            return validMaxLengthMessage('User Name', meta, element);
          },
        },
        startedDateFrom: {
          validDate: messages.EBT008('Started Date From'),
        },
        startedDateTo: {
          validDate: messages.EBT008('Started Date To'),
          validFromTo: messages.EBT044,
        },
      },
    });
  }

  $('#startedDateFrom').on('change', function(e) {
    $('#startedDateFrom').valid();
    $('#startedDateTo').valid();
  });
  $('#startedDateTo').on('change', function(e) {
    $('#startedDateFrom').valid();
    $('#startedDateTo').valid();
  });

  $('#searchButton').on('click', function(e) {
    if ($('#searchFrm').valid()) {
      let $this = $(this);
      e.preventDefault();
      $.LoadingOverlay('show');
      $('#searchFrm').submit();
      setTimeout(function() {
        $.LoadingOverlay('hide');
      }, 500);
    } else {
      $('#username').valid();
      $('#startedDateFrom').valid();
      $('#startedDateTo').valid();
    }
  });

  $('#clearButton').on('click', function() {
    $('#username').val('');
    $('#startedDateFrom').val('');
    $('#startedDateTo').val('');

    $('#username').valid();
    $('#startedDateFrom').valid();
    $('#startedDateTo').valid();
  });

  $('#exportButton').on('click', function() {
    const searchConditions = JSON.parse($('#searchConditions').val());
    $.ajax({
      type: 'get',
      url: '/user/export',
      data: searchConditions,
      success: function(res) {
        const blob = new Blob([res], {type: 'text/csv'});

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');

        a.setAttribute('href', url);

        const date = new Date();
        const dateStr =
          date.getFullYear() +
          ('00' + (date.getMonth() + 1)).slice(-2) +
          ('00' + date.getDate()).slice(-2) +
          ('00' + date.getHours()).slice(-2) +
          ('00' + date.getMinutes()).slice(-2) +
          ('00' + date.getSeconds()).slice(-2);

        const filename = `list_user_${dateStr}.csv`;

        a.setAttribute('download', filename);

        a.click();
      },
      error: function(e) {
        return;
      },
    });
  });

  $('#importButton').on('click', function(e) {
    $('#fileCSV').click();
  });

  $('input:file').on('change', function(e) {
    if ($('#fileCSV').valid()) {
      const formData = new FormData();
      formData.append('file', $('#fileCSV')[0].files[0]);

      $.ajax({
        url: '/user/import',
        method: 'POST',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function() {
          location.reload();
        },
      });
    } else {
      $('#fileCSV').valid();
    }
  });

  $('#startedDateFrom').datepicker({
    dateFormat: 'dd/mm/yy',
  });

  $('#startedDateTo').datepicker({
    dateFormat: 'dd/mm/yy',
  });
});

function deleteButtonOnClick(e, id) {
  $('#myModal').modal('show');

  $('#message').html(messages.I018(id));

  $('#okButton').on('click', function() {
    $.ajax({
      type: 'get',
      url: `/user/delete/${id}`,
      success: function() {
        $(e)
          .parent()
          .parent()
          .remove();
      },
    });
  });
}

function gotoPage(page) {
  let searchConditions = JSON.parse($('#searchConditions').val());
  searchConditions = {...searchConditions, page};
  const query = '?' + new URLSearchParams(searchConditions).toString();
  const link = window.location.origin + window.location.pathname + query;
  window.location.href = link;
}
