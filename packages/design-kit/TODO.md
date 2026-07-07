# Design-kit todo's

## Library

- [ ] add custom element manifests
- [ ] add @required annotation for runtime property checking

## Core

- [ ] Add custom `MhEvent` or a `MhEventOptions` constant to avoid repeating the same event options in all events.

## Icon§

- [ ] add cache
- [ ] add more stock icons
- [ ] sanitize or other strategy for XSS protection
- [ ] unit test that ensures all svgs have `fill="currentColor"`
- [ ] generate an `iconName` type from existing svg files in `/packages/design-kit/src/icon/svg/`

## Radio group

- [ ] group identifier should be form reference + group name (not just name); see
      https://github.com/smals-belgium/myhealth/pull/8/changes/7e091fb7c96d11fbb0c5734622b3eca084195df6#r3342719879

## A11y CDK

- Look into building a custom variant on Angular's [Accessibility CDK](https://material.angular.dev/cdk/a11y/overview), more specifically for the [Focus trap](https://material.angular.dev/cdk/a11y/overview#focustrap) which we could implement in the dialog and other components.

## Dialog

- [ ] Define clear dialog width standards for dialog (confirm with ux)

## Fonts

- [ ] Provide JS script to override font-family if strictly necessary

## Components roadmap

### Phase 1 — Shared MAGS/Portal Components

Core primitives required in both shared MAGS contexts and Portal feature flows.

- [x] [@angular/material/icon](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=52816-615)
- [x] [@angular/material/button](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=20-2461) & [Link (anchor)](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=53478-967)
- [x] [Button icon](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=54110-178)
- [ ] @angular/material/form-field
- [ ] [@angular/material/input](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=52855-836)
- [ ] [@angular/material/select](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=54213-264)
- [x] [@angular/material/checkbox](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=53478-1006)
- [x] [@angular/material/radio](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=53086-1299)
- [x] [@angular/material/dialog](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=53172-220)
- [x] [@angular/material/progress-spinner](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=54114-1172)
- [x] [@angular/material/snack-bar](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=54932-380)
- [x] [@angular/material/card](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=53126-1280)
- [x] [@angular/material/divider](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=52837-541)
- [x] [Skeleton](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=54711-816)
- [x] [Alert](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=53395-807)

### Phase 2 — Additional Portal Components

Portal-heavy components that are used in advanced flows or composed screens.

- [ ] [@angular/material/chips](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=53101-760)
- [ ] [@angular/material/list](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=52823-173)
- [ ] [@angular/material/expansion](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=54380-311)
- [ ] [@angular/material/autocomplete](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=53041-2313)
- [ ] [@angular/material/datepicker](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=53200-128)
- [ ] [@angular/material/tabs](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=52977-240)
- [x] [@angular/material/table](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=52977-240)
- [ ] [@angular/material/paginator](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=52834-2800)
- [ ] @angular/material/sort
- [x] [@angular/material/slide-toggle](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=55049-2438)
- [ ] [@angular/material/tooltip](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=57643-3531)
- [ ] [Dropdown button](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=54443-118)
- [ ] [Menu](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=56513-2127)
- [ ] @angular/material/sidenav

### Phase 3 — Nice to Haves

- [ ] @angular/material/toolbar
- [ ] [@angular/material/progress-bar](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=53529-69)
- [ ] [@angular/material/stepper](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=54760-422)

### Phase 4 - Additional components

These should be included in the design-system roadmap in addition to the Material-based migration phases.

- [ ] [Bottom sheet](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=56126-7238)
- [ ] [Drag and drop upload field](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=54114-574)
