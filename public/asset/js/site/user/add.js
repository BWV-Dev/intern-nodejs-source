$(function() {
  $(window).on('pageshow', function() {
    checkLoginStatus();
  });

  $(document).ready(function() {
    checkLoginStatus();
    truncateAndWrapOptions('#groupId');
    formValidation();
  });
  

  $.validator.addMethod('validPass', function(value) {
    const regex = /^(?=.*\d)(?=.*[A-Za-z])[0-9A-Za-z]+$/;
    return regex.test(value);
  });

  $.validator.addMethod("maxLengthPass", function(value) {
    if(value.length < 8 || value.length > 20) {
      return false;
    }
    return true;
  });

  $.validator.addMethod("singleByte", function(value) {
    return /^[a-zA-Z0-9ｧ-ﾝﾞﾟｦ-ﾟ -~]+$/.test(value);
  });

  $.validator.addMethod("matchPassword", function(value) {
    const password = $("#password").val();
    return value==password? true : false;
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
      errorPlacement: function (err, el) {
        err.addClass('help-block').appendTo(el.parent());
        $('#errorMessage').html('');
      },
      focusInvalid: false,
      rules: {
        username: {
          required: true,
          maxlength: 100,
        },
        email: {
          required: true,
          maxlength: 225,
          singleByte: true,
          validEmail: true,
          isExistAccount: true
        },
        positionId: {
          requiredSelect: true
        },
        startedDate: {
          required: true,
          singleByte: true,
          validDate: true,
        },
        groupId: {
          requiredSelect: true
        },
        password: {
          required: true,
          maxLengthPass: 20,
          singleByte: true,
          validPass: true,
        },
        passConfirm: {
          required: true,
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
          singleByte: messages.EBT004('User Name')
        },
        email: {
          required: messages.EBT001('Email'),
          maxlength: function(meta, element) {
            return validMaxLengthMessage('Email', meta, element);
          },
          singleByte: messages.EBT004('Email'),
          validEmail: messages.EBT005,
          isExistAccount: messages.EBT019
        },
        positionId: {
          requiredSelect: messages.EBT001('Position')
        },
        startedDate: {
          required: messages.EBT001('Started Date'),
          singleByte: messages.EBT004('Started Date'),
          validDate: messages.EBT008('Started Date'),
        },
        groupId: {
          requiredSelect: messages.EBT001('Group')
        },
        password: {
          required: messages.EBT001('Password'),
          maxLengthPass: messages.EBT023,
          singleByte: messages.EBT004('Password'),
          validPass: messages.EBT025,
        },
        passConfirm: {
          required: messages.EBT001('Password Confirmation'),
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
    $('#passConfirm').valid();
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

  $('#registerButton').on('click', function(e) {
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

  $('#startedDate').datepicker({
    dateFormat: 'dd/mm/yy'
  });

  $.validator.addMethod("isExistAccount", function (value, element) {
    let result = true;
  
    $.ajax({
      type: "post",
      url: '/isExistAccount',
      data: {
        email: () => $('#email').val()
      },
      dataType: "json",
      success: function (data) {
        if(data == 'Found') {
          result = false;
        } else {
          result = true;
        }
      },
      async: false
  });
    
    return result;
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