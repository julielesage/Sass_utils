// La validation a échoué, on réaffiche le formulaire en ajax, avec les erreurs.
if (validationResult.validationFailed) {
  const ajaxComponent = new AjaxComponent(that.containerSelector, action + '/validate');
  ajaxComponent.onSuccessCallback = () => {
      that.initSelectDeliveryModeFromListBehavior();
      that.showMobilePhoneInput();
      that.unprotectContent(that.containerSelector);
      new CheckPhonePatronymAsked(that.formSelector, () => that.protectContent(that.containerSelector)).init();
  };
  ajaxComponent.post(data, false);
} else {
  // Dans le cas contraire (tout va bien), on fait une soumission simple, sans ajax.
  if (formElement != null && !navigateToPaymentPage) {
      formElement.classList.add('protected');
      formElement.submit();
  } else {
      $('#payment-page-form').submit();
  }
}

// if confirm is 'Yes'
$('#removeThis').on('click', function () {
  let storeId = that.data("store-id");
  let appointmentsId = that.data("appointments-id");
  let page = that.data("page");
  let url = '/appointment/ajax/delete/my-appointment/' + storeId + '?appointmentsId=' + appointmentsId + '&page=' + page;
  let ajaxComponent = new AjaxComponent(".my-next-appointments", url);

  // @ts-ignore
  ajaxComponent.onSuccessCallback = () => currentObj.onSuccessLoad();
  // @ts-ignore
  ajaxComponent.onFailCallback = () => currentObj.onErrorLoad();

  ajaxComponent.get();
});
