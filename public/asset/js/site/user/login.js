import {
  showLoading,
  hideLoading,
  disabledButton,
  enableButton,
  checkMaxLength,
} from './common.js';
import {messages} from '../constants.js';

// add method check valid email address
$.validator.addMethod('emailValid', function(value, element) {
  return (
    this.optional(element) ||
    /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i.test(value)
  );
});

$(document).ready(function() {
  // remove error messages and check valid when change input
  $('input#email').on('input', function() {
    $('button.btn-close').click();
    checkMaxLength('checkEmailMaxLength255', 255, 'Email', 'input#email' )
  });


  // remove error messages and check valid when change input
  $('input#password').on('input', function() {
    $('button.btn-close').click();

    // validate password length
    checkMaxLength('checkPasswordMaxLength25', 20, 'Password', 'input#password' )

  });

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
        emailValid: true,
        checkEmailMaxLength255: true,
      },
      password: {
        required: true,
        checkPasswordMaxLength25: true,
      },
    },
    messages: {
      email: {
        required: messages.ECL001('Email'),
        emailValid: messages.ECL005,
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

    // if admin login form invalid then do nothing
    if (!$('#adminLoginForm').valid()) return;

    // get values of email and password
    const email = $('#email').val();
    const password = $('#password').val();

    // show loading
    showLoading();

    // disable button login
    disabledButton('#signInBtn');

    // send request to server
    $.ajax({
      type: 'POST',
      data: {
        email,
        password,
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
        window.location.href = result;
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
