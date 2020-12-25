// All Stripe Elements fields have a `data-elements-stable-field-name`
// attribute that can be used to target it.
//
// This type is meant to hint you about the basic card input fields you can fill.
//
// In case we haven't added a stable field name to this list, you can always
// fallback to passing a `string`.
type CypressStripeElementsFieldName = 'cardCvc' | 'cardNumber' | 'cardExpiry' | 'postalCode' | string;

const getSelectorForField = (name: CypressStripeElementsFieldName): string => {
  return `input[data-elements-stable-field-name="${name}"]`;
}

Cypress.Commands.add('fillElementsInput', (field: CypressStripeElementsFieldName, value: string): void => {
  if (Cypress.config('chromeWebSecurity')) {
    throw new Error(
      "You must set `{ \"chromeWebSecurity\": false }` in `cypress.json`, " +
      "or cypress-plugin-stripe-elements cannot access the Stripe Elements " +
      "<iframe> to perform autofill."
    );
  }

  const selector = getSelectorForField(field);

  cy
    .get('iframe')
    .should(iframe => expect(iframe.contents().find(selector)).to.exist)
    .then(iframe => cy.wrap(iframe.contents().find(selector)))
    .within(input => {
      cy.wrap(input).type(value);
    });
})