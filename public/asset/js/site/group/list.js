$(function() {
  $(window).on('pageshow', function() {
    checkLoginStatus();
  });

  $(document).ready(function() {
    checkLoginStatus();
    formValidation();
  });

  $.validator.addMethod('fileSize', function(value, element, param) {
    return this.optional(element) || element.files[0].size <= param * 1000000;
  });

  $.validator.addMethod('fileExtension', function(value, element, param) {
    var extension = value
      .split('.')
      .pop()
      .toLowerCase();
    return this.optional(element) || $.inArray(extension, param) !== -1;
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
        fileCSV: {
          fileExtension: ['csv'],
          fileSize: 1,
        },
      },
      messages: {
        fileCSV: {
          fileExtension: messages.EBT033('CSV'),
          fileSize: messages.EBT034('1 MB'),
        },
      },
      errorPlacement: function(error, element) {
        error.appendTo('#fileError');
      },
    });
  }

  $('#importButton').on('click', function(e) {
    $('#fileCSV').click();
  });

  $('input:file').on('change', function(e) {

    if ($('#fileCSV').valid()) {
      const formData = new FormData();
      formData.append('file', $('#fileCSV')[0].files[0]);

      $.LoadingOverlay('show');

      $.ajax({
        url: '/group/import',
        method: 'POST',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function() {
          $.LoadingOverlay('hide');
          location.reload();
        },
        async: false,
      });
    } else {
      $('#fileCSV').valid();
    }
  });

  const scrollableElements = $('#messages');

  scrollableElements.on('mousewheel', function(event) {
    event.preventDefault();
    const scrollAmount = event.originalEvent.wheelDelta;
    $(this).scrollTop($(this).scrollTop() - scrollAmount);
  });
});

function gotoPage(page) {
  const query = `?page=${page}`;
  const link = window.location.origin + window.location.pathname + query;
  window.location.href = link;
}
