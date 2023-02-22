import { FormControl } from "@angular/forms";
import { WarningSound } from "../../../shared/types/warning-sound.type";

export interface SettingForm {
  minutes: FormControl<number | null>;
  sound: FormControl<WarningSound | null>
 }
