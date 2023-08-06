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
  const prompt = document.querySelector("#prompt").value;
  const bars = document.querySelector("#bars").value;

  const data = {
    prompt: prompt,
    bars: bars,
  };

  try {
    // Initial check
    const checkResponse = await fetch("http://127.0.0.1:8000/");
    if (checkResponse.status !== 200) {
      throw new Error(`Server check failed! status: ${checkResponse.status}`);
    }
    const checkData = await checkResponse.json();
    if (checkData.status !== "ok") {
      throw new Error(
        `Server check failed! Unexpected response: ${checkData.status}`
      );
    }

    const name_prompt =
      "Please generate a name for a music file generated with the following prompt: " +
      prompt +
      ". DO NOT include the file extension. For example, give the result lovely_trumpets not lovely_trumpets.wav.";

    const name_response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer " + "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",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: name_prompt }],
          temperature: 0.7,
        }),
      }
    );

    const nameData = await name_response.json();
    console.log(nameData);

    const file_name = nameData.choices[0].message.content + ".wav";

    console.log(file_name);

    data.file_name = file_name;

    // Proceed to generate
    const response = await fetch("http://127.0.0.1:8000/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
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
                <div class="plugin-panel__generate" style="margin-top: 20px;">
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
