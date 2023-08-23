$(function () {

  $(document).ready( function() {
    formValidation();
  });

  /**
   * Form validation
   */
  function formValidation() {
    // Form Validation
    $('#loginFrm').validate({
      lang: 'ja',
      errorElement: 'span',
      errorClass: 'mf-5 text-danger align-middle d-block',
      onkeyup: function(element) {
        $(element).valid();
      },
      onfocusout: function(element) {$(element).valid()},
      rules: {
        password: {
          required: true
        },
        email: {
          required: true,
          validEmail: true
        },
      },
      messages: {
        password: {
          required: messages.EBT001('Password')
        },
        email: {
          required: messages.EBT001('Email'),
          validEmail: messages.EBT005
        }
      }
    });
  }

  $('#email').on('focusout', function() {
    if(!$('#email').valid()) {
      $('#errorMessage').html('');
    }
  })

  $('#password').on('focusout', function() {
    if(!$('#password').valid()) {
      $('#errorMessage').html('');
    }
  })

  $('#loginBtn').on('click', function(e) {
    if($('#loginFrm').valid()) {
        e.preventDefault();
        $.LoadingOverlay('show');
        $('#loginFrm').submit();
        sessionStorage.setItem('logoutStatus', 'false');
        setTimeout(function(){
          $.LoadingOverlay('hide'); 
        }, 1500);
    } else {
      $('#email').valid();
      $('#password').valid();
    }
  })
})