import {messages, regexList} from '../constants.js';
import {
  disabledButton,
  enableButton,
  hideLoading,
  showLoading,
} from './common.js';

function checkDateMonthYearFrom(dateInput) {
  const regex = /^\d{4}\/\d{2}\/\d{2}$/;
  if (regex.test(dateInput)) {
    let [year, month, date] = dateInput.split('/');
    const month_1 = parseInt('01');
    const month_2 = parseInt('02');
    const month_3 = parseInt('03');
    const month_4 = parseInt('04');
    const month_5 = parseInt('05');
    const month_6 = parseInt('06');
    const month_7 = parseInt('07');
    const month_8 = parseInt('08');
    const month_9 = parseInt('09');
    const month_10 = parseInt('10');
    const month_11 = parseInt('11');
    const month_12 = parseInt('12');

    if (year % 4 == 0) {
      if (month == month_2) {
        if (date > 29) {
          return false;
        }
      }
    } else {
      if (month == month_2) {
        if (date > 28) {
          return false;
        }
      }
      if (
        month == month_4 ||
        month == month_6 ||
        month == month_9 ||
        month == month_11
      ) {
        if (date > 30) {
          return false;
        }
      }
      if (
        month == month_1 ||
        month == month_3 ||
        month == month_5 ||
        month == month_7 ||
        month == month_8 ||
        month == month_10 ||
        month == month_12
      ) {
        if (date > 31) {
          return false;
        }
      }
    }

    if (month > month_12) {
      return false;
    }

    return true;
  } else {
    return false;
  }
}

$(document).ready(function() {
  // check register or update
  const isRegister = $('#checkAddOrEdit').val() === '';
  const isUpdate = $('#checkAddOrEdit').val() !== '';

  // add method check password validation
  $.validator.addMethod('passwordValidation', function(value) {
    if (value.length == 0) {
      return true;
    }
    return regexList.PASSWORD.test(value);
  });

  // add method check valid email address
  $.validator.addMethod('emailValid', function(value, element) {
    return this.optional(element) || regexList.EMAIL.test(value);
  });

  // initialize validation method
  const initMethodCheckLength = function(
    nameMethod,
    maxLength,
    nameInput,
    inputSelector,
  ) {
    $.validator.addMethod(
      nameMethod,
      function(value) {
        if (value.length > maxLength) {
          return false;
        } else {
          return true;
        }
      },
      `${messages.ECL002(nameInput, maxLength, $(inputSelector).val().length)}`,
    );
  };

  const initCheckCharacters1Byte = function() {
    $.validator.addMethod('checkCharacters1Byte', function(value, element) {
      if (value.length == 0 || regexList.HALFWIDTH.test(value)) {
        return true;
      } else {
        return false;
      }
    });
  };

  const initCheckValidateFormatDate = function() {
    $.validator.addMethod(
      'checkValidateFormatDate',
      function(value) {
        if (value.length == 0) return true;

        let isValid = checkDateMonthYearFrom(value);
        if (isValid == false) {
          return false;
        }

        const regex = /^\d{4}\/\d{2}\/\d{2}$/;
        return regex.test(value);
      },
      `${messages.ECL008('Entered Date')}`,
    );
  };
  initCheckValidateFormatDate();
  initCheckCharacters1Byte();
  initMethodCheckLength('checkNameMaxLength50', 50, 'User Name', 'input#name');
  initMethodCheckLength('checkEmailMaxLength255', 255, 'Email', 'input#email');
  initMethodCheckLength(
    'checkPasswordConfirmationMaxLength20',
    20,
    'Password Confirmation',
    'input#passwordConfirmation',
  );

  $('input#email').on('input', () => {
    initMethodCheckLength(
      'checkEmailMaxLength255',
      255,
      'Email',
      'input#email',
    );
    $('input#email').valid();
  });

  $('input#email').on('focusout', () => {
    $('input#email').valid();
  });

  $('input#name').on('input', () => {
    initMethodCheckLength(
      'checkNameMaxLength50',
      50,
      'User Name',
      'input#name',
    );

    initCheckCharacters1Byte();

    $('input#name').valid();
  });
  $('input#name').on('focusout', () => {
    $('input#name').valid();
  });

  $('input#passwordConfirmation').on('input', () => {
    initMethodCheckLength(
      'checkPasswordConfirmationMaxLength20',
      20,
      'Password Confirmation',
      'input#passwordConfirmation',
    );

    $('input#passwordConfirmation').valid();
  });

  // check valid input when have events
  $('input#enteredDate').on('focusout', () => {
    $('input#enteredDate').valid();
  });
  $('input#enteredDate').on('change', () => {
    $('input#enteredDate').valid();
  });
  $('input#enteredDate').on('input', () => {
    $('input#enteredDate').valid();
  });

  $('input#password').on('focusout', () => {
    $('input#password').valid();
    $('input#passwordConfirmation').valid();
  });
  $('input#password').on('input', () => {
    $('input#password').valid();
    $('input#passwordConfirmation').valid();
  });

  $('select#role').on('change', () => {
    $('select#role').valid();
  });

  $('select#role').on('focusout', () => {
    $('select#role').valid();
  });

  // if screen is register user
  if (isRegister) {
    $('#addEditForm').validate({
      rules: {
        name: {
          required: true,
          checkCharacters1Byte: true,
          checkNameMaxLength50: true,
        },
        email: {
          required: true,
          emailValid: true,
          checkCharacters1Byte: true,
          checkEmailMaxLength255: true,
        },
        role: {
          required: true,
        },
        password: {
          required: true,
          rangelength: [8, 20],
          checkCharacters1Byte: true,
          passwordValidation: true,
        },
        passwordConfirmation: {
          required: true,
          checkCharacters1Byte: true,
          checkPasswordConfirmationMaxLength20: true,
          equalTo: '#password',
        },
      },
      messages: {
        name: {
          required: messages.ECL001('User Name'),
          checkCharacters1Byte: messages.ECL004('User Name'),
        },
        email: {
          required: messages.ECL001('Email'),
          emailValid: messages.ECL005,
          checkCharacters1Byte: messages.ECL004('Email'),
        },
        role: {
          required: messages.ECL001('Role'),
        },
        password: {
          required: messages.ECL001('Password'),
          checkCharacters1Byte: messages.ECL004('Password'),
          rangelength: messages.ECL023,
          passwordValidation: messages.ECL023,
        },
        passwordConfirmation: {
          required: messages.ECL001('Password Confirmation'),
          checkCharacters1Byte: messages.ECL004('Password Confirmation'),
          equalTo: messages.ECL030,
        },
      },
      errorPlacement: function(error, element) {
        const placement = $(element).data('error');
        placement ? $(placement).append(error) : error.insertAfter(element);
      },
      highlight: function(element) {
        $(element)
          .parent()
          .next()
          .css('display', 'block');

        $(element)
          .next()
          .css('display', 'block');
      },
      unhighlight: function(element) {
        $(element)
          .parent()
          .next()
          .css('display', 'none');

        $(element)
          .next()
          .css('display', 'none');
      },
    });

    // handle register user events
    $(document).on('click', '#registerBtn', function(e) {
      e.preventDefault();

      $('#addEditForm').valid();

      if ($('#addEditForm').valid()) {
        showLoading();
        disabledButton('#registerBtn');
        const name = $('#name').val();
        const email = $('#email').val();
        const role = $('#role').val();
        const password = $('#password').val();
        const passwordConfirmation = $('#passwordConfirmation').val();

        $.ajax({
          type: 'POST',
          data: {
            name,
            email,
            role,
            password,
            passwordConfirmation,
          },
          success: function(result) {
            $('#loading').addClass('d-none');
            enableButton('#registerBtn');
            $('#addUpdateDeleteModal').modal('show');
            if (result === 'success') {
              $('#addEditForm').trigger('reset');
              $('#addUpdateDeleteModal .modal-body').html('');
              $('#addUpdateDeleteModal .modal-body').append(`
                <div class="alert alert-success alert-dismissible fade show mb-0" style="border-radius: 0px" role="alert">
                <p class="m-0">${messages.ICL096}</p>
                </div>
                `);
              window.location.href = '/user/list';
            }
          },

          error: function(e) {
            $('#loading').addClass('d-none');
            enableButton('#registerBtn');
            $('#addUpdateDeleteModal').modal('show');
            $('#addUpdateDeleteModal .modal-body').html('');
            if (e.status == 400 && e.responseJSON.error === 'ValidateFailed') {
              for (let i = 0; i < e.responseJSON.message.length; i++) {
                $('#addUpdateDeleteModal .modal-body').append(`
                <div class="alert alert-danger alert-dismissible fade show mb-0" style="border-radius: 0px" role="alert">
                <p class="m-0">${e.responseJSON.message[i]}</p>
                </div>
                `);
              }
            }

            if (e.status == 400 && e.responseJSON.error === 'Duplicate') {
              $('#addUpdateDeleteModal .modal-body').append(`
              <div class="alert alert-danger alert-dismissible fade show mb-0" style="border-radius: 0px" role="alert">
              <p class="m-0">${e.responseJSON.message}</p>
              </div>
              `);
            }
          },
        });
      }
    });
  }

  // if screen is update user
  if (isUpdate) {
    // add method pwdConfirmationRequired
    $.validator.addMethod('pwdConfirmationRequired', function(value) {
      if ($('input#password').val().length > 0 && value.length == 0) {
        return false;
      }
      return true;
    });

    $('#addEditForm').validate({
      rules: {
        name: {
          required: true,
          checkCharacters1Byte: true,
          checkNameMaxLength50: true,
        },
        email: {
          required: true,
          emailValid: true,
          checkCharacters1Byte: true,
          checkEmailMaxLength255: true,
        },
        role: {
          required: true,
        },
        password: {
          checkCharacters1Byte: true,
          rangelength: [8, 20],
          passwordValidation: true,
        },
        passwordConfirmation: {
          checkCharacters1Byte: true,
          pwdConfirmationRequired: true,
          checkPasswordConfirmationMaxLength20: true,
          equalTo: '#password',
        },
      },
      messages: {
        name: {
          required: messages.ECL001('User Name'),
          checkCharacters1Byte: messages.ECL004('User Name'),
        },
        email: {
          required: messages.ECL001('Email'),
          emailValid: messages.ECL005,
          checkCharacters1Byte: messages.ECL004('Email'),
        },
        role: {
          required: messages.ECL001('Role'),
        },
        password: {
          rangelength: messages.ECL023,
          passwordValidation: messages.ECL023,
          checkCharacters1Byte: messages.ECL004('Password'),
        },
        passwordConfirmation: {
          pwdConfirmationRequired: messages.ECL001('Password Confirmation'),
          checkCharacters1Byte: messages.ECL004('Password Confirmation'),
          equalTo: messages.ECL030,
        },
      },
      errorPlacement: function(error, element) {
        const placement = $(element).data('error');
        placement ? $(placement).append(error) : error.insertAfter(element);
      },
      highlight: function(element) {
        $(element)
          .parent()
          .next()
          .css('display', 'block');
        $(element)
          .next()
          .css('display', 'block');
      },
      unhighlight: function(element) {
        $(element)
          .parent()
          .next()
          .css('display', 'none');
        $(element)
          .next()
          .css('display', 'none');
      },
    });

    // handle update user events
    $(document).on('click', '#updateBtn', function(e) {
      e.preventDefault();
      if($('p#deletedMsgUser').text() == `登録・更新・削除処理に失敗しました。`) {
        $('#addUpdateDeleteModal .modal-body').html('');
              $('button#cancelDeleteBtn').html('Close');
              $('#modalDelete #confirmDelete').addClass('d-none');
              $('#modalDelete #confirmDelete').css('display', 'none');
              $('#addUpdateDeleteModal .modal-body').append(`
                  <div class="alert alert-danger alert-dismissible fade show mb-0" style="border-radius: 0px" role="alert">
                  <p class="m-0" id="deletedMsgUser">登録・更新・削除処理に失敗しました。</p>
                  </div>
                  `);      
      }
      $('#addEditForm').valid();

      if ($('#addEditForm').valid()) {
        showLoading();
        disabledButton('#updateBtn');
        const id = $('#getIdUser').val();
        const name = $('#name').val();
        const email = $('#email').val();
        const role = $('#role').val();
        const password = $('#password').val();
        const passwordConfirmation = $('#passwordConfirmation').val();

        $.ajax({
          type: 'POST',
          data: {
            id,
            name,
            email,
            role,
            password,
            passwordConfirmation,
          },
          success: function(result) {
            $('#loading').addClass('d-none');
            enableButton('#updateBtn');
            $('#addUpdateDeleteModal').modal('show');
            // if result === false (not handle logout)
            if (result == false) {
              $('#addUpdateDeleteModal .modal-body').html('');
              $('#addUpdateDeleteModal .modal-body').append(`
                <div class="alert alert-success alert-dismissible fade show mb-0" style="border-radius: 0px" role="alert">
                <p class="m-0">${messages.ICL096}</p>
                </div>
                `);

              window.location.href = '/user/list';
            }

            $('input#password, input#passwordConfirmation').val('');

            // if result === true (handle logout)
            if (result == true) {
              window.location.href = '/logout';
            }
          },

          error: function(e) {
            $('#loading').addClass('d-none');
            enableButton('#updateBtn');
            $('#addUpdateDeleteModal').modal('show');
            $('#addUpdateDeleteModal .modal-body').html('');

            if (e.status == 400 && e.responseJSON.error === 'ValidateFailed') {
              for (let i = 0; i < e.responseJSON.message.length; i++) {
                $('#addUpdateDeleteModal .modal-body').append(`
                <div class="alert alert-danger alert-dismissible fade show mb-0" style="border-radius: 0px" role="alert">
                <p class="m-0">${e.responseJSON.message[i]}</p>
                </div>
                `);
              }
            }

            if (e.status == 400 && e.responseJSON.error === 'Duplicate' || e.status == 400 && e.responseJSON.error === 'NotFound') {
              $('#addUpdateDeleteModal .modal-body').append(`
              <div class="alert alert-danger alert-dismissible fade show mb-0" style="border-radius: 0px" role="alert">
              <p class="m-0" id="deletedMsgUser">${e.responseJSON.message}</p>
              </div>
              `);
            }
          },
        });
      }
    });
  }

  // handle delete user events
  $(document).on('click', '#deleteBtn', function(e) {
    
    e.preventDefault();
    $('button#cancelDeleteBtn').html('Cancel');
    $('button#confirmDelete').html('Ok');
    if($('p#deletedMsgUser').text() == `登録・更新・削除処理に失敗しました。`) {
      $('#addUpdateDeleteModal .modal-body').html('');
            $('button#cancelDeleteBtn').html('Close');
            $('button#confirmDelete').html('Ok');
            $('#modalDelete #confirmDelete').addClass('d-none');
            $('#modalDelete #confirmDelete').css('display', 'none');
            $('#addUpdateDeleteModal .modal-body').append(`
                <div class="alert alert-danger alert-dismissible fade show mb-0" style="border-radius: 0px" role="alert">
                <p class="m-0" id="deletedMsgUser">登録・更新・削除処理に失敗しました。</p>
                </div>
                `);
    }
    // get user login id
    const userLoginId = $('input#loginUserId').val();

    // get user delete id
    const userDeleteId = $(this).data('id');

    if (userDeleteId == userLoginId) {
      $('#addUpdateDeleteModal').modal('show');
      $('#addUpdateDeleteModal .modal-body').html('');
      $('#addUpdateDeleteModal .modal-body').append(`
                <div class="alert alert-danger alert-dismissible fade show mb-0" style="border-radius: 0px" role="alert">
                <p class="m-0" id="deletedMsgUser">${messages.ECL086}</p>
                </div>
                `);

      return true;
    }

    $('#addUpdateDeleteModal').modal('show');
    $('#audm-heading').html('');
    $('.modal-body #modal-audm-text').html('このユーザーを削除しますか？');
    $('button#confirmDelete').removeClass('d-none');

    $('button#confirmDelete').on('click', function(e) {
      e.preventDefault();
      showLoading();
      disabledButton('button#confirmDelete');

      $.ajax({
        type: 'GET',
        url: `/user/delete/${userDeleteId}`,
        success: function(result) {
          $('#loading').addClass('d-none');
          enableButton('button#confirmDelete');
          $('button#confirmDelete').addClass('d-none');
          $('#addUpdateDeleteModal').modal('show');
          if (result == true) {
            $('#addUpdateDeleteModal .modal-body').html('');
            $('#addUpdateDeleteModal .modal-body').append(`
                <div class="alert alert-success alert-dismissible fade show mb-0" style="border-radius: 0px" role="alert">
                <p class="m-0" id="deletedMsgUser">${messages.ICL096}</p>
                </div>
                `);
            window.location.href = '/user/list';
          }
        },

        error: function(e) {
          $('#loading').addClass('d-none');
          enableButton('button#confirmDelete');
          $('#addUpdateDeleteModal .modal-body').html('');
          $('button#confirmDelete').addClass('d-none');
          $('#addUpdateDeleteModal').modal('show');
          if (e.status == 400) {
            $('#addUpdateDeleteModal .modal-body').html('');
            $('button#cancelDeleteBtn').html('Close');
            $('#modalDelete #confirmDelete').addClass('d-none');
            $('#modalDelete #confirmDelete').css('display', 'none');
            $('#addUpdateDeleteModal .modal-body').append(`
                <div class="alert alert-danger alert-dismissible fade show mb-0" style="border-radius: 0px" role="alert">
                <p class="m-0" id="deletedMsgUser">登録・更新・削除処理に失敗しました。</p>
                </div>
                `);
          }
        },
      });
    });
  });

  // handle cancel button
  $(document).on('click', '#cancelBtn', function(e) {
    e.preventDefault();
    window.location.href = '/user/list';
  });

  // auto close enteredDate
  $('#enteredDate').datepicker({
    dateFormat: 'yy/mm/dd',
    changeMonth: true,
    changeYear: true,
  });
});