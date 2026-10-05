Feature: Sauce login (Lesson 15 - Gherkin parity with MyfirstCucumberProject)

  # Mirrors login.feature Scenario 1: Validate login functionality with valid credentials
  @smoke @regression
  Scenario: valid login shows products page
    Given user is on login page
    When user logs in as "standard_user"
    Then products page is visible
