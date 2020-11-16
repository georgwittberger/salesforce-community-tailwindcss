import { api, LightningElement } from 'lwc';

export default class Sctw_IconsRow extends LightningElement {
  @api heading;
  @api firstIcon;
  @api firstText;
  @api secondIcon;
  @api secondText;
  @api thirdIcon;
  @api thirdText;

  renderedCallback() {
    const firstIconWrapper = this.template.querySelector('.first-icon-wrapper');
    if (this.firstIcon && firstIconWrapper) {
      insertIconIntoElement(this.firstIcon, firstIconWrapper);
    }
    const secondIconWrapper = this.template.querySelector(
      '.second-icon-wrapper'
    );
    if (this.secondIcon && secondIconWrapper) {
      insertIconIntoElement(this.secondIcon, secondIconWrapper);
    }
    const thirdIconWrapper = this.template.querySelector('.third-icon-wrapper');
    if (this.thirdIcon && thirdIconWrapper) {
      insertIconIntoElement(this.thirdIcon, thirdIconWrapper);
    }
  }
}

// Feather Icons, see https://feathericons.com/
const iconsSvg = {
  layout:
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-layout w-full h-auto"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>',
  package:
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-package w-full h-auto"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>',
  sliders:
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-sliders w-full h-auto"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>'
};

function insertIconIntoElement(iconType, htmlElement) {
  if (iconsSvg[iconType]) {
    // eslint-disable-next-line @lwc/lwc/no-inner-html
    htmlElement.insertAdjacentHTML('beforeend', iconsSvg[iconType]);
  }
}
