// Show Loading
export const showLoading = function() {
  $('#loading').removeClass('d-none');
};

// Hide Loading
export const hideLoading = function() {
  $('#loading').addClass('d-none');
};

// Disabled Button
export const disabledButton = function(buttonId) {
  $(buttonId).attr('disabled', true);
};

// Enable Button
export const enableButton = function(buttonId) {
  $(buttonId).attr('disabled', false);
};

// Escape Data
export const escape = function(data) {
    return data.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};