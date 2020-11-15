import { api, LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class Sctw_HeroTeaser extends NavigationMixin(LightningElement) {
  @api title;
  @api text;
  @api primaryButtonLabel;
  @api primaryButtonTarget;
  @api secondaryButtonLabel;
  @api secondaryButtonTarget;

  navigateToPage(event) {
    this[NavigationMixin.Navigate]({
      type: 'comm__namedPage',
      attributes: {
        name: event.currentTarget.dataset.target
      }
    });
  }
}
