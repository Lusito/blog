export type EventHandler<TTarget extends EventTarget, TEvent extends Event> = (
    this: TTarget,
    ev: Omit<TEvent, "currentTarget"> & { readonly currentTarget: TTarget }
) => void;

export interface EventAttributes<T extends EventTarget> {
    // Image Events
    onLoad?: EventHandler<T, Event>;
    onLoadCapture?: EventHandler<T, Event>;
    onError?: EventHandler<T, Event>;
    onErrorCapture?: EventHandler<T, Event>;

    // Clipboard Events
    onCopy?: EventHandler<T, ClipboardEvent>;
    onCopyCapture?: EventHandler<T, ClipboardEvent>;
    onCut?: EventHandler<T, ClipboardEvent>;
    onCutCapture?: EventHandler<T, ClipboardEvent>;
    onPaste?: EventHandler<T, ClipboardEvent>;
    onPasteCapture?: EventHandler<T, ClipboardEvent>;

    // Composition Events
    onCompositionEnd?: EventHandler<T, CompositionEvent>;
    onCompositionEndCapture?: EventHandler<T, CompositionEvent>;
    onCompositionStart?: EventHandler<T, CompositionEvent>;
    onCompositionStartCapture?: EventHandler<T, CompositionEvent>;
    onCompositionUpdate?: EventHandler<T, CompositionEvent>;
    onCompositionUpdateCapture?: EventHandler<T, CompositionEvent>;

    // Details Events
    onToggle?: EventHandler<T, Event>;

    // Focus Events
    onFocus?: EventHandler<T, FocusEvent>;
    onFocusCapture?: EventHandler<T, FocusEvent>;
    onBlur?: EventHandler<T, FocusEvent>;
    onBlurCapture?: EventHandler<T, FocusEvent>;

    // Form Events
    onChange?: EventHandler<T, Event>;
    onChangeCapture?: EventHandler<T, Event>;
    onInput?: EventHandler<T, Event>;
    onInputCapture?: EventHandler<T, Event>;
    onSearch?: EventHandler<T, Event>;
    onSearchCapture?: EventHandler<T, Event>;
    onSubmit?: EventHandler<T, Event>;
    onSubmitCapture?: EventHandler<T, Event>;
    onInvalid?: EventHandler<T, Event>;
    onInvalidCapture?: EventHandler<T, Event>;
    onReset?: EventHandler<T, Event>;
    onResetCapture?: EventHandler<T, Event>;
    onFormData?: EventHandler<T, Event>;
    onFormDataCapture?: EventHandler<T, Event>;

    // Keyboard Events
    onKeyDown?: EventHandler<T, KeyboardEvent>;
    onKeyDownCapture?: EventHandler<T, KeyboardEvent>;
    onKeyPress?: EventHandler<T, KeyboardEvent>;
    onKeyPressCapture?: EventHandler<T, KeyboardEvent>;
    onKeyUp?: EventHandler<T, KeyboardEvent>;
    onKeyUpCapture?: EventHandler<T, KeyboardEvent>;

    // Media Events
    onAbort?: EventHandler<T, Event>;
    onAbortCapture?: EventHandler<T, Event>;
    onCanPlay?: EventHandler<T, Event>;
    onCanPlayCapture?: EventHandler<T, Event>;
    onCanPlayThrough?: EventHandler<T, Event>;
    onCanPlayThroughCapture?: EventHandler<T, Event>;
    onDurationChange?: EventHandler<T, Event>;
    onDurationChangeCapture?: EventHandler<T, Event>;
    onEmptied?: EventHandler<T, Event>;
    onEmptiedCapture?: EventHandler<T, Event>;
    onEncrypted?: EventHandler<T, Event>;
    onEncryptedCapture?: EventHandler<T, Event>;
    onEnded?: EventHandler<T, Event>;
    onEndedCapture?: EventHandler<T, Event>;
    onLoadedData?: EventHandler<T, Event>;
    onLoadedDataCapture?: EventHandler<T, Event>;
    onLoadedMetadata?: EventHandler<T, Event>;
    onLoadedMetadataCapture?: EventHandler<T, Event>;
    onLoadStart?: EventHandler<T, Event>;
    onLoadStartCapture?: EventHandler<T, Event>;
    onPause?: EventHandler<T, Event>;
    onPauseCapture?: EventHandler<T, Event>;
    onPlay?: EventHandler<T, Event>;
    onPlayCapture?: EventHandler<T, Event>;
    onPlaying?: EventHandler<T, Event>;
    onPlayingCapture?: EventHandler<T, Event>;
    onProgress?: EventHandler<T, Event>;
    onProgressCapture?: EventHandler<T, Event>;
    onRateChange?: EventHandler<T, Event>;
    onRateChangeCapture?: EventHandler<T, Event>;
    onSeeked?: EventHandler<T, Event>;
    onSeekedCapture?: EventHandler<T, Event>;
    onSeeking?: EventHandler<T, Event>;
    onSeekingCapture?: EventHandler<T, Event>;
    onStalled?: EventHandler<T, Event>;
    onStalledCapture?: EventHandler<T, Event>;
    onSuspend?: EventHandler<T, Event>;
    onSuspendCapture?: EventHandler<T, Event>;
    onTimeUpdate?: EventHandler<T, Event>;
    onTimeUpdateCapture?: EventHandler<T, Event>;
    onVolumeChange?: EventHandler<T, Event>;
    onVolumeChangeCapture?: EventHandler<T, Event>;
    onWaiting?: EventHandler<T, Event>;
    onWaitingCapture?: EventHandler<T, Event>;

    // MouseEvents
    onClick?: EventHandler<T, MouseEvent>;
    onClickCapture?: EventHandler<T, MouseEvent>;
    onContextMenu?: EventHandler<T, MouseEvent>;
    onContextMenuCapture?: EventHandler<T, MouseEvent>;
    onDblClick?: EventHandler<T, MouseEvent>;
    onDblClickCapture?: EventHandler<T, MouseEvent>;
    onDrag?: EventHandler<T, DragEvent>;
    onDragCapture?: EventHandler<T, DragEvent>;
    onDragEnd?: EventHandler<T, DragEvent>;
    onDragEndCapture?: EventHandler<T, DragEvent>;
    onDragEnter?: EventHandler<T, DragEvent>;
    onDragEnterCapture?: EventHandler<T, DragEvent>;
    onDragExit?: EventHandler<T, DragEvent>;
    onDragExitCapture?: EventHandler<T, DragEvent>;
    onDragLeave?: EventHandler<T, DragEvent>;
    onDragLeaveCapture?: EventHandler<T, DragEvent>;
    onDragOver?: EventHandler<T, DragEvent>;
    onDragOverCapture?: EventHandler<T, DragEvent>;
    onDragStart?: EventHandler<T, DragEvent>;
    onDragStartCapture?: EventHandler<T, DragEvent>;
    onDrop?: EventHandler<T, DragEvent>;
    onDropCapture?: EventHandler<T, DragEvent>;
    onMouseDown?: EventHandler<T, MouseEvent>;
    onMouseDownCapture?: EventHandler<T, MouseEvent>;
    onMouseEnter?: EventHandler<T, MouseEvent>;
    onMouseEnterCapture?: EventHandler<T, MouseEvent>;
    onMouseLeave?: EventHandler<T, MouseEvent>;
    onMouseLeaveCapture?: EventHandler<T, MouseEvent>;
    onMouseMove?: EventHandler<T, MouseEvent>;
    onMouseMoveCapture?: EventHandler<T, MouseEvent>;
    onMouseOut?: EventHandler<T, MouseEvent>;
    onMouseOutCapture?: EventHandler<T, MouseEvent>;
    onMouseOver?: EventHandler<T, MouseEvent>;
    onMouseOverCapture?: EventHandler<T, MouseEvent>;
    onMouseUp?: EventHandler<T, MouseEvent>;
    onMouseUpCapture?: EventHandler<T, MouseEvent>;

    // Selection Events
    onSelect?: EventHandler<T, Event>;
    onSelectCapture?: EventHandler<T, Event>;

    // Touch Events
    onTouchCancel?: EventHandler<T, TouchEvent>;
    onTouchCancelCapture?: EventHandler<T, TouchEvent>;
    onTouchEnd?: EventHandler<T, TouchEvent>;
    onTouchEndCapture?: EventHandler<T, TouchEvent>;
    onTouchMove?: EventHandler<T, TouchEvent>;
    onTouchMoveCapture?: EventHandler<T, TouchEvent>;
    onTouchStart?: EventHandler<T, TouchEvent>;
    onTouchStartCapture?: EventHandler<T, TouchEvent>;

    // Pointer Events
    onPointerOver?: EventHandler<T, PointerEvent>;
    onPointerOverCapture?: EventHandler<T, PointerEvent>;
    onPointerEnter?: EventHandler<T, PointerEvent>;
    onPointerEnterCapture?: EventHandler<T, PointerEvent>;
    onPointerDown?: EventHandler<T, PointerEvent>;
    onPointerDownCapture?: EventHandler<T, PointerEvent>;
    onPointerMove?: EventHandler<T, PointerEvent>;
    onPointerMoveCapture?: EventHandler<T, PointerEvent>;
    onPointerUp?: EventHandler<T, PointerEvent>;
    onPointerUpCapture?: EventHandler<T, PointerEvent>;
    onPointerCancel?: EventHandler<T, PointerEvent>;
    onPointerCancelCapture?: EventHandler<T, PointerEvent>;
    onPointerOut?: EventHandler<T, PointerEvent>;
    onPointerOutCapture?: EventHandler<T, PointerEvent>;
    onPointerLeave?: EventHandler<T, PointerEvent>;
    onPointerLeaveCapture?: EventHandler<T, PointerEvent>;
    onGotPointerCapture?: EventHandler<T, PointerEvent>;
    onGotPointerCaptureCapture?: EventHandler<T, PointerEvent>;
    onLostPointerCapture?: EventHandler<T, PointerEvent>;
    onLostPointerCaptureCapture?: EventHandler<T, PointerEvent>;

    // UI Events
    onScroll?: EventHandler<T, UIEvent>;
    onScrollCapture?: EventHandler<T, UIEvent>;

    // Wheel Events
    onWheel?: EventHandler<T, WheelEvent>;
    onWheelCapture?: EventHandler<T, WheelEvent>;

    // Animation Events
    onAnimationStart?: EventHandler<T, AnimationEvent>;
    onAnimationStartCapture?: EventHandler<T, AnimationEvent>;
    onAnimationEnd?: EventHandler<T, AnimationEvent>;
    onAnimationEndCapture?: EventHandler<T, AnimationEvent>;
    onAnimationIteration?: EventHandler<T, AnimationEvent>;
    onAnimationIterationCapture?: EventHandler<T, AnimationEvent>;

    // Transition Events
    onTransitionEnd?: EventHandler<T, TransitionEvent>;
    onTransitionEndCapture?: EventHandler<T, TransitionEvent>;
}
