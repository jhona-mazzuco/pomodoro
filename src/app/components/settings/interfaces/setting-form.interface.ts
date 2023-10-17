import { FormControl } from "@angular/forms";
import { WarningSound } from "../../../shared/types/warning-sound";

export interface SettingForm {
  workTime: FormControl<number | null>;
  restTime: FormControl<number | null>;
  sound: FormControl<WarningSound | null>
 }
