$(document).ready(function() {
  // validate when focusout
  $('input#email').on('focusout', function() {
    $('input#email').valid();
  });

  $('input#password').on('focusout', function() {
    $('input#password').valid();
  });

  // validate login form
  $('#adminLoginForm').validate({
    onfocusout: false,
    onclick: false,
    rules: {
      email: {
        required: true,
      },
      password: {
        required: true,
      },
    },
    messages: {
      email: {
        required: messages.ECL001('Email'),
      },
      password: {
        required: messages.ECL001('Password'),
      },
    },
    errorPlacement: function(error, element) {
      let placement = $(element).data('error');
      placement ? $(placement).append(error) : error.insertAfter(element);
    },
    highlight: function(element) {
      if( element.id == 'email') {
        $('#emailMsg').css('display', 'block');
        $('#checkEmailValidateIcon').css('display', 'block');
      }

      if( element.id == 'password') {
        $('#passwordMsg').css('display', 'block');
        $('#checkPasswordValidateIcon').css('display', 'block');
      }
    },
    unhighlight: function(element) {
      if( element.id == 'email') {
        $('#emailMsg').css('display', 'none');
        $('#checkEmailValidateIcon').css('display', 'none');
      }

      if( element.id == 'password') {
        $('#passwordMsg').css('display', 'none');
        $('#checkPasswordValidateIcon').css('display', 'none');
      }
    },
  });

  // handle when click button login
  $('#signInBtn').on('click', function(e) {
    e.preventDefault();
    $('#errorLoginMsg').html('');
    const formDataEle = $('#adminLoginForm');

    // if admin login form invalid then do nothing
    if (!formDataEle.valid()) return;

    // show loading
    showLoading();

    // disable button login
    disabledButton('#signInBtn');

    // send request to server
    $.ajax({
      type: 'POST',
      data: {
        ...formDataEle.serializeJSON(),
      },
      dataType: 'json',
      crossDomain: true,
      xhrFields: {
        withCredentials: true,
      },

      // if login success then redirect to href
      success: function(result) {
        hideLoading();
        enableButton('#signInBtn');
        console.log(result);
        window.location.href = result.urlRedirect ? `/${result.urlRedirect}` : result;
      },
      error: function(e) {
        hideLoading();
        enableButton('#signInBtn');

        // if login failed then show error message
        if (e.status == 400) {
          $('#errorLoginMsg').append(`<div
            id="errorMsg"
            class="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            ${e.responseJSON.message}
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="alert"
              aria-label="Close"
              style="visibility: hidden"
            ></button>
          </div>`);
        }
      },
    });
  });
});
