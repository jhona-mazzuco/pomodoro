import { FormControl } from "@angular/forms";
import { AttentionAudio } from "../../../shared/types/attention-audio.type";

export interface SettingForm {
  minutes: FormControl<number | null>;
  sound: FormControl<AttentionAudio>
 }
