import { render, html } from "lit";
import "./style.scss";

// This function sends an HTTP request to the server to open
// https://magenta.tensorflow.org/studio/ in the default browser.
// In CEF, you can't open links in the default browser, but it is
// possible to do this in Max.
function handleOpenWebsite(e) {
  e.preventDefault();
  fetch(e.target.href);
}

export function About(parentElement) {
  render(
    html`
      <div class="about" style="overflow:scroll">
        <h2 id="title">A Foresaken Garden</h2>
        <p>I enter the court</p>

        <p>Through the middle gate—</p>

        <p>And my sleeve is wet with tears.</p>

        <p>The flowers still grow</p>

        <p>In the courtyard,</p>

        <p>Though two springs have fled</p>

        <p>Since last their master came.</p>

        <p>The windows, porch, and bamboo screen</p>

        <p>Are just as they always were,</p>

        <p>But at the entrance to the house</p>

        <p>Someone is missing—</p>

        <p>You!</p>
        <p>Po Chu-I</p>
        <!--
      <p>
        <h3>License</h3>
        Copyright 2019 Google Inc.
        <br><br>
        Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
        <br><br>
        http://www.apache.org/licenses/LICENSE-2.0
        <br><br>
        Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
      </p>
    </div>
    -->
      </div>
    `,
    parentElement
  );
}
