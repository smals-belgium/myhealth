import { html, TemplateResult } from 'lit';

export type FormControl = {
  help?: string;
  hint?: string;
};

export type RenderFormField = {
  host: FormControl;
  renderInput: () => TemplateResult | string;
  renderExtra?: () => TemplateResult | string;
};

export const renderFormField = ({
  host,
  renderInput,
  renderExtra,
}: RenderFormField) => html`
  <label part="base">
    <slot
      id="label"
      part="label"
      name=${renderExtra ? 'label' : null}
    >
    </slot>

    <div
      id="help"
      part="help"
    >
      ${host.help}
    </div>

    ${renderInput.bind(host)()}
  </label>

  ${renderExtra?.bind(host)()}

  <div
    id="hint"
    part="hint"
  >
    ${host.hint}
  </div>
`;
