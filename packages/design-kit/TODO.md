# Design-kit todo's

## Library

- add custom element manifests
- add @required annotation for runtime property checking

## Icon

- add cache
- add more stock icons
- sanitize or other strategy for XSS protection
- unit test that ensures all svgs have `fill="currentColor"`

## Radio group

- group identifier should be form reference + group name (not just name); see
  https://github.com/smals-belgium/myhealth/pull/8/changes/7e091fb7c96d11fbb0c5734622b3eca084195df6#r3342719879

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
- [ ] [@angular/material/dialog](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=53172-220)
- [x] [@angular/material/progress-spinner](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=54114-1172)
- [ ] [@angular/material/snack-bar](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=54932-380)
- [x] [@angular/material/card](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=53126-1280)
- [x] [@angular/material/divider](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=52837-541)
- [ ] [Skeleton](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=54711-816)
- [ ] [Alert](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=53395-807)

### Phase 2 — Additional Portal Components

Portal-heavy components that are used in advanced flows or composed screens.

- [ ] [@angular/material/chips](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=53101-760)
- [ ] [@angular/material/list](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=52823-173)
- [ ] [@angular/material/expansion](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=54380-311)
- [ ] [@angular/material/autocomplete](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=53041-2313)
- [ ] [@angular/material/datepicker](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=53200-128)
- [ ] [@angular/material/tabs](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=52977-240)
- [ ] [@angular/material/table](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=52977-240)
- [ ] [@angular/material/paginator](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=52834-2800)
- [ ] @angular/material/sort
- [ ] [@angular/material/slide-toggle](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=55049-2438)

### Phase 3 — Nice to Haves

- [ ] @angular/material/toolbar
- [ ] @angular/material/sidenav
- [ ] [@angular/material/progress-bar](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=53529-69)
- [ ] [@angular/material/stepper](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=54760-422)
- [ ] [@angular/material/tooltip](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=57643-3531)

### Phase 4 - Additional components

These should be included in the design-system roadmap in addition to the Material-based migration phases.

- [ ] [Bottom sheet](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=56126-7238)
- [ ] [Dropdown button](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=54443-118)
- [ ] [Drag and drop upload field](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=54114-574)
- [ ] [Menu](https://www.figma.com/design/OvonpzXEpimUD9FZfDVvgF/MaSant%C3%A9---Global-Design-System?node-id=56513-2127)
