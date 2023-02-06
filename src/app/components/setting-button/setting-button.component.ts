import { Overlay } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { Component } from '@angular/core';
import { faCog } from "@fortawesome/free-solid-svg-icons/faCog";
import { SettingsComponent } from "../settings/settings.component";

@Component({
  selector: 'app-setting-button',
  templateUrl: './setting-button.component.html',
  styleUrls: ['./setting-button.component.scss']
})
export class SettingButtonComponent {
  settingIcon = faCog;

  constructor(private overlay: Overlay) {
  }
  open(): void {
    const ref = this.overlay.create({
      hasBackdrop: true,
      disposeOnNavigation: true,
      positionStrategy: this.overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically()
    });


    ref.backdropClick().subscribe(() => ref.detach());

    const settingPortal = new ComponentPortal(SettingsComponent);
    const componentRef = ref.attach(settingPortal);
    componentRef.instance.close.subscribe(() => ref.detach());
  }
}
