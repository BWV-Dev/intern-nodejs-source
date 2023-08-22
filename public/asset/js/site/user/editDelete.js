$(function() {
  $(window).on('pageshow', function() {
    checkLoginStatus();
  });

  $(document).ready(function() {
    checkLoginStatus();
    truncateAndWrapOptions('#groupId');
    formValidation();
  });

  $.validator.addMethod('requiredPass', function(value) {
    const password = $('#password').val();
    const passConfirm = $('#passConfirm').val();

    if ((password == '' && passConfirm == '') || value != '') {
      return true;
    }

    return false;
  });

  $.validator.addMethod('validPass', function(value) {
    if (value == '') {
      return true;
    }
    const regex = /^(?=.*\d)(?=.*[A-Za-z])[0-9A-Za-z]+$/;
    return regex.test(value);
  });

  $.validator.addMethod('maxLengthPass', function(value) {
    if (value != '' && (value.length < 8 || value.length > 20)) {
      return false;
    }
    return true;
  });

  $.validator.addMethod('singleByte', function(value) {
    if (value == '') {
      return true;
    }
    return /^[a-zA-Z0-9ｧ-ﾝﾞﾟｦ-ﾟ -~]+$/.test(value);
  });

  $.validator.addMethod('matchPassword', function(value) {
    const password = $('#password').val();
    if (value != password && value != '' && password != '') {
      return false;
    }
    return true;
  });

  /**
   * Form validation
   */
  function formValidation() {
    // Form Validation
    $('#handleFrm').validate({
      lang: 'ja',
      errorElement: 'span',
      errorClass: 'mf-5 text-danger align-middle d-block',
      onkeyup: function(element) {
        $(element).valid();
      },
      onblur: function(element) {
        $(element).valid();
      },
      onfocusout: function(element) {
        $(element).valid();
      },
      errorPlacement: function(err, el) {
        err.addClass('help-block').appendTo(el.parent());
        $('#errorMessage').html('');
      },
      focusInvalid: false,
      rules: {
        username: {
          required: true,
          maxlength: 100
        },
        email: {
          required: true,
          maxlength: 225,
          singleByte: true,
          validEmail: true,
          isExistAccount: true,
        },
        positionId: {
          requiredSelect: true,
        },
        startedDate: {
          required: true,
          singleByte: true,
          validDate: true,
        },
        groupId: {
          requiredSelect: true,
        },
        password: {
          requiredPass: true,
          maxLengthPass: true,
          singleByte: true,
          validPass: true,
        },
        passConfirm: {
          requiredPass: true,
          singleByte: true,
          matchPassword: true,
        },
      },
      messages: {
        username: {
          required: messages.EBT001('User Name'),
          maxlength: function(meta, element) {
            return validMaxLengthMessage('User Name', meta, element);
          },
          singleByte: messages.EBT004('User Name'),
        },
        email: {
          required: messages.EBT001('Email'),
          maxlength: function(meta, element) {
            return validMaxLengthMessage('Email', meta, element);
          },
          singleByte: messages.EBT004('Email'),
          validEmail: messages.EBT005,
          isExistAccount: messages.EBT019,
        },
        positionId: {
          requiredSelect: messages.EBT001('Position'),
        },
        startedDate: {
          required: messages.EBT001('Started Date'),
          singleByte: messages.EBT004('Started Date'),
          validDate: messages.EBT008('Started Date'),
        },
        groupId: {
          requiredSelect: messages.EBT001('Group'),
        },
        password: {
          requiredPass: messages.EBT001('Password'),
          maxLengthPass: messages.EBT023,
          singleByte: messages.EBT004('Password'),
          validPass: messages.EBT025,
        },
        passConfirm: {
          requiredPass: messages.EBT001('Password Confirmation'),
          singleByte: messages.EBT004('Password Confirmation'),
          matchPassword: messages.EBT030,
        },
      },
    });
  }

  $('#password').on('change', function(e) {
    $('#passConfirm').valid();
  });

  $('#passConfirm').on('change', function(e) {
    $('#password').valid();
  });

  $('#startedDate').on('change', function(e) {
    $('#startedDate').valid();
  });

  $('#positionId').on('change', function(e) {
    $('#positionId').valid();
  });

  $('#groupId').on('change', function(e) {
    $('#groupId').valid();
  });

  $('#updateButton').on('click', function(e) {
    if ($('#handleFrm').valid()) {
      let $this = $(this);
      e.preventDefault();
      $.LoadingOverlay('show');
      $('#handleFrm').submit();
      setTimeout(function() {
        $.LoadingOverlay('hide');
      }, 500);
    } else {
      $('#username').valid();
      $('#email').valid();
      $('#startedDate').valid();
      $('#password').valid();
      $('#passConfirm').valid();
      $('#positionId').valid();
      $('#groupId').valid();
    }
  });

  $('#cancelButton').on('click', function() {
    const previousPageUrl = document.referrer;
    if (
      previousPageUrl.indexOf('/user') !== -1 &&
      previousPageUrl.indexOf('/user/add') == -1
    ) {
      history.back();
    } else {
      window.location = '/user';
    }
  });

  $('#deleteButton').on('click', function() {
    const id = $('#id').val();
    const loginId = $('#loginId').val();

    if (id == loginId) {
      $('#errorMessage').css('display', 'block');
      $('#errorMessage').html(messages.EBT086);
    } else {
      $('#myModal').modal('show');

      $('#message').html('このユーザーを削除してもいいですか？');

      $('#okButton').on('click', function() {
        $.ajax({
          type: 'post',
          url: `/user/delete/${id}`,
          success: function(data) {
            if (data == messages.EBT086) {
              $('#errorMessage').css('display', 'block');
              $('#errorMessage').html(messages.EBT086);
            } else {
              window.location = '/user';
            }
          },
        });
      });
    }
  });

  if ($('select').is('[disabled]')) {
    const selectedValuePosition = $('#positionId').val();
    const selectedValueGroup = $('#groupId').val();

    $('<input>')
      .attr({
        type: 'hidden',
        name: 'positionId',
        value: selectedValuePosition,
      })
      .appendTo('#handleFrm');

    $('<input>')
      .attr({
        type: 'hidden',
        name: 'groupId',
        value: selectedValueGroup,
      })
      .appendTo('#handleFrm');
    $(this)
      .find('select :not(option:selected)')
      .prop('disabled', true);
  }

  if ($('#startedDate').is('[readonly]')) {
    $('#datepicker').datepicker({
      beforeShow: function(input, inst) {
        $(input).prop('readonly', true);
      },
      onClose: function(dateText, inst) {
        $(this).datepicker('setDate', dateText);
        $(this).prop('readonly', false);
      },
    });
  } else {
    $('#startedDate').datepicker({
      dateFormat: 'dd/mm/yy',
    });
  }

  $.validator.addMethod('isExistAccount', function(value, element) {
    let result = true;

    $.ajax({
      type: 'post',
      url: '/isExistAccount',
      data: {
        id: () => $('#id').val(),
        email: () => $('#email').val(),
      },
      dataType: 'json',
      success: function(data) {
        if (data == 'Found') {
          result = false;
        } else {
          result = true;
        }
      },
      async: false,
    });

    return result;
  });
});
