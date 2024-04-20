import { adjustFontSize } from "./css-utils";
import createSpyObj = jasmine.createSpyObj;
import { createSpyHTMLElement } from "../test/test-utils";

describe('adjustFontSize', () => {

  it('should increase font size', () => {
    const textElement = createSpyHTMLElement()
    const container = createSpyHTMLElement()

    adjustFontSize(textElement, container)

    expect(window.getComputedStyle(textElement).fontSize).toBeDefined() // TODO terminer l'assertion
  });

});
