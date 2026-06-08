export interface GradientEditorDirection {
  label: string;
  value: string;
}

export interface GradientEditorStop {
  color: string;
  pos: number;
}

export type GradientEditorStopKey = keyof GradientEditorStop;

export interface DragOrigin {
  mx: number;
  my: number;
  px: number;
  py: number;
}

export interface GradientEditorPos {
  x: number;
  y: number;
}