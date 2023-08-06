/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// import '../../components/theme.scss'
// import './main.scss'
import { render, html } from "lit";
import { Model } from "./Model";
import "./style.scss";

const models = {
  drums: new Model(true),
  melody: new Model(false),
};

async function generate() {
  if (!validate()) {
    return;
  }
  setStatus("Generating...");
  //get all the attributes
  const mode = document.querySelector("#mode").value;
  const length = document.querySelector("#length").value;
  const temp = document.querySelector("#temperature").value;
  const variations = document.querySelector("#variations").value;
  try {
    const inputMidi = await document.querySelector("magenta-midi-file").read();
    const output = await models[mode].predict(
      inputMidi,
      length * 16,
      temp,
      variations
    );
    await document.querySelector("magenta-midi-file").write(output, "CONTINUE");
  } catch (e) {
    const snackbar = document.createElement("magenta-snackbar");
    snackbar.setAttribute("message", e);
    snackbar.setAttribute("whoops", "");
    snackbar.setAttribute("error", "");
    document.body.appendChild(snackbar);
    setStatus("");
    throw e;
  }
  setStatus("");
}

function validate() {
  if (controls.classList.contains("generating")) {
    return false;
  }
  const promptValue = document.querySelector("#prompt").value.trim();
  const valid = promptValue.length > 0; // Checking if the textarea has content
  const button = document.querySelector("#generate");
  if (valid) {
    button.removeAttribute("disabled");
  } else {
    button.setAttribute("disabled", "");
  }
  return valid;
}

function setStatus(status, error = false) {
  const element = document.querySelector("magenta-button");
  const controls = document.querySelector("#controls");
  if (status === "") {
    element.setAttribute("label", "Generate");
    controls.classList.remove("generating");
  } else {
    element.setAttribute("label", status);
    controls.classList.add("generating");
  }
}

export function Continue(parentElement) {
  const initialized = Promise.all([models.drums.load(), models.melody.load()]);
  initialized.then(() => {
    setStatus("");
    validate();
  });

  render(
    html`
      <div id="continue">
        <div id="title">AbleGen</div>
        <div class="plugin-content">
          <div id="controls">
              <div class="input-box">
                <label for="prompt" style="color: #f5f5f5;">Prompt:</label>
                <textarea id="prompt" @change=${validate} rows="2" cols="50">
A series of intense and ear-piercing cowbell sounds.</textarea>
              </div>
              <div class="input-box">
                <label for="bars" style="color: #f5f5f5; width: 100px;"
                  >Number of Bars:</label
                >
                <input
                  type="number"
                  id="bars"
                  min="1"
                  value="1"
                  style="width: 100px;"
                />
                </div>
                <div class="plugin-panel__generate" style="margin-top: 22px;">
                  <magenta-output-text></magenta-output-text>
                  <magenta-button
                    disabled
                    id="generate"
                    label="Initializing..."
                    @click=${generate}
                  ></magenta-button>
                </div>
            </div>
          </div>
        </div>
      </div>
    `,
    parentElement
  );
}
