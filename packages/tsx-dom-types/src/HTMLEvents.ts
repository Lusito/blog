export type EventHandler<E extends Event> = (event: E) => void;

export type ClipboardEventHandler = EventHandler<ClipboardEvent>;
export type CompositionEventHandler = EventHandler<CompositionEvent>;
export type DragEventHandler = EventHandler<DragEvent>;
export type FocusEventHandler = EventHandler<FocusEvent>;
export type KeyboardEventHandler = EventHandler<KeyboardEvent>;
export type MouseEventHandler = EventHandler<MouseEvent>;
export type TouchEventHandler = EventHandler<TouchEvent>;
export type UIEventHandler = EventHandler<UIEvent>;
export type WheelEventHandler = EventHandler<WheelEvent>;
export type AnimationEventHandler = EventHandler<AnimationEvent>;
export type TransitionEventHandler = EventHandler<TransitionEvent>;
export type GenericEventHandler = EventHandler<Event>;
export type PointerEventHandler = EventHandler<PointerEvent>;

export interface HTMLEvents {
  // Image Events
  onLoad?: GenericEventHandler;
  onLoadCapture?: GenericEventHandler;

  // Clipboard Events
  onCopy?: ClipboardEventHandler;
  onCopyCapture?: ClipboardEventHandler;
  onCut?: ClipboardEventHandler;
  onCutCapture?: ClipboardEventHandler;
  onPaste?: ClipboardEventHandler;
  onPasteCapture?: ClipboardEventHandler;

  // Composition Events
  onCompositionEnd?: CompositionEventHandler;
  onCompositionEndCapture?: CompositionEventHandler;
  onCompositionStart?: CompositionEventHandler;
  onCompositionStartCapture?: CompositionEventHandler;
  onCompositionUpdate?: CompositionEventHandler;
  onCompositionUpdateCapture?: CompositionEventHandler;

  // Focus Events
  onFocus?: FocusEventHandler;
  onFocusCapture?: FocusEventHandler;
  onBlur?: FocusEventHandler;
  onBlurCapture?: FocusEventHandler;

  // Form Events
  onChange?: GenericEventHandler;
  onChangeCapture?: GenericEventHandler;
  onInput?: GenericEventHandler;
  onInputCapture?: GenericEventHandler;
  onSearch?: GenericEventHandler;
  onSearchCapture?: GenericEventHandler;
  onSubmit?: GenericEventHandler;
  onSubmitCapture?: GenericEventHandler;

  // Keyboard Events
  onKeyDown?: KeyboardEventHandler;
  onKeyDownCapture?: KeyboardEventHandler;
  onKeyPress?: KeyboardEventHandler;
  onKeyPressCapture?: KeyboardEventHandler;
  onKeyUp?: KeyboardEventHandler;
  onKeyUpCapture?: KeyboardEventHandler;

  // Media Events
  onAbort?: GenericEventHandler;
  onAbortCapture?: GenericEventHandler;
  onCanPlay?: GenericEventHandler;
  onCanPlayCapture?: GenericEventHandler;
  onCanPlayThrough?: GenericEventHandler;
  onCanPlayThroughCapture?: GenericEventHandler;
  onDurationChange?: GenericEventHandler;
  onDurationChangeCapture?: GenericEventHandler;
  onEmptied?: GenericEventHandler;
  onEmptiedCapture?: GenericEventHandler;
  onEncrypted?: GenericEventHandler;
  onEncryptedCapture?: GenericEventHandler;
  onEnded?: GenericEventHandler;
  onEndedCapture?: GenericEventHandler;
  onLoadedData?: GenericEventHandler;
  onLoadedDataCapture?: GenericEventHandler;
  onLoadedMetadata?: GenericEventHandler;
  onLoadedMetadataCapture?: GenericEventHandler;
  onLoadStart?: GenericEventHandler;
  onLoadStartCapture?: GenericEventHandler;
  onPause?: GenericEventHandler;
  onPauseCapture?: GenericEventHandler;
  onPlay?: GenericEventHandler;
  onPlayCapture?: GenericEventHandler;
  onPlaying?: GenericEventHandler;
  onPlayingCapture?: GenericEventHandler;
  onProgress?: GenericEventHandler;
  onProgressCapture?: GenericEventHandler;
  onRateChange?: GenericEventHandler;
  onRateChangeCapture?: GenericEventHandler;
  onSeeked?: GenericEventHandler;
  onSeekedCapture?: GenericEventHandler;
  onSeeking?: GenericEventHandler;
  onSeekingCapture?: GenericEventHandler;
  onStalled?: GenericEventHandler;
  onStalledCapture?: GenericEventHandler;
  onSuspend?: GenericEventHandler;
  onSuspendCapture?: GenericEventHandler;
  onTimeUpdate?: GenericEventHandler;
  onTimeUpdateCapture?: GenericEventHandler;
  onVolumeChange?: GenericEventHandler;
  onVolumeChangeCapture?: GenericEventHandler;
  onWaiting?: GenericEventHandler;
  onWaitingCapture?: GenericEventHandler;

  // MouseEvents
  onClick?: MouseEventHandler;
  onClickCapture?: MouseEventHandler;
  onContextMenu?: MouseEventHandler;
  onContextMenuCapture?: MouseEventHandler;
  onDblClick?: MouseEventHandler;
  onDblClickCapture?: MouseEventHandler;
  onDrag?: DragEventHandler;
  onDragCapture?: DragEventHandler;
  onDragEnd?: DragEventHandler;
  onDragEndCapture?: DragEventHandler;
  onDragEnter?: DragEventHandler;
  onDragEnterCapture?: DragEventHandler;
  onDragExit?: DragEventHandler;
  onDragExitCapture?: DragEventHandler;
  onDragLeave?: DragEventHandler;
  onDragLeaveCapture?: DragEventHandler;
  onDragOver?: DragEventHandler;
  onDragOverCapture?: DragEventHandler;
  onDragStart?: DragEventHandler;
  onDragStartCapture?: DragEventHandler;
  onDrop?: DragEventHandler;
  onDropCapture?: DragEventHandler;
  onMouseDown?: MouseEventHandler;
  onMouseDownCapture?: MouseEventHandler;
  onMouseEnter?: MouseEventHandler;
  onMouseEnterCapture?: MouseEventHandler;
  onMouseLeave?: MouseEventHandler;
  onMouseLeaveCapture?: MouseEventHandler;
  onMouseMove?: MouseEventHandler;
  onMouseMoveCapture?: MouseEventHandler;
  onMouseOut?: MouseEventHandler;
  onMouseOutCapture?: MouseEventHandler;
  onMouseOver?: MouseEventHandler;
  onMouseOverCapture?: MouseEventHandler;
  onMouseUp?: MouseEventHandler;
  onMouseUpCapture?: MouseEventHandler;

  // Selection Events
  onSelect?: GenericEventHandler;
  onSelectCapture?: GenericEventHandler;

  // Touch Events
  onTouchCancel?: TouchEventHandler;
  onTouchCancelCapture?: TouchEventHandler;
  onTouchEnd?: TouchEventHandler;
  onTouchEndCapture?: TouchEventHandler;
  onTouchMove?: TouchEventHandler;
  onTouchMoveCapture?: TouchEventHandler;
  onTouchStart?: TouchEventHandler;
  onTouchStartCapture?: TouchEventHandler;

  // Pointer Events
  onPointerOver?: PointerEventHandler;
  onPointerOverCapture?: PointerEventHandler;
  onPointerEnter?: PointerEventHandler;
  onPointerEnterCapture?: PointerEventHandler;
  onPointerDown?: PointerEventHandler;
  onPointerDownCapture?: PointerEventHandler;
  onPointerMove?: PointerEventHandler;
  onPointerMoveCapture?: PointerEventHandler;
  onPointerUp?: PointerEventHandler;
  onPointerUpCapture?: PointerEventHandler;
  onPointerCancel?: PointerEventHandler;
  onPointerCancelCapture?: PointerEventHandler;
  onPointerOut?: PointerEventHandler;
  onPointerOutCapture?: PointerEventHandler;
  onPointerLeave?: PointerEventHandler;
  onPointerLeaveCapture?: PointerEventHandler;
  onGotPointerCapture?: PointerEventHandler;
  onGotPointerCaptureCapture?: PointerEventHandler;
  onLostPointerCapture?: PointerEventHandler;
  onLostPointerCaptureCapture?: PointerEventHandler;

  // UI Events
  onScroll?: UIEventHandler;
  onScrollCapture?: UIEventHandler;

  // Wheel Events
  onWheel?: WheelEventHandler;
  onWheelCapture?: WheelEventHandler;

  // Animation Events
  onAnimationStart?: AnimationEventHandler;
  onAnimationStartCapture?: AnimationEventHandler;
  onAnimationEnd?: AnimationEventHandler;
  onAnimationEndCapture?: AnimationEventHandler;
  onAnimationIteration?: AnimationEventHandler;
  onAnimationIterationCapture?: AnimationEventHandler;

  // Transition Events
  onTransitionEnd?: TransitionEventHandler;
  onTransitionEndCapture?: TransitionEventHandler;
}
