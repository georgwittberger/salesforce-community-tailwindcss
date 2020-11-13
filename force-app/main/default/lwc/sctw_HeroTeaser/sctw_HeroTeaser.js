import { api, LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class Sctw_HeroTeaser extends NavigationMixin(LightningElement) {
  @api title;
  @api text;
  @api ctaLabel;
  @api ctaTarget;

  navigateToCtaTarget() {
    this[NavigationMixin.Navigate]({
      type: 'comm__namedPage',
      attributes: {
        name: this.ctaTarget
      }
    });
  }
}
