import Vue from 'vue';
import i18n from '../plugins/i18n';

const handleError = (error) => {
  if (error.status === 499) return;
  console.error(error);

  const context = new Vue();
  const code = String(error.response.status);
  const errorText = i18n.t(
    `errorsNotifications.${
      i18n.t('errorsNotifications').hasOwnProperty(code) ? code : 'ERR_SERVICE'
    }`,
  );

  context.$bvToast.toast(errorText, {
    title: i18n.t('errorsNotifications.error'),
    autoHideDelay: 4000,
    variant: 'danger',
    appendToast: false,
  });
};

export default handleError;
