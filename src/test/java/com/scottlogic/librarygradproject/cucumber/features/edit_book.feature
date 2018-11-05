Feature: Correctly editing books in the database

  Background:
    Given a filled book repository exists

  Scenario: An edit book request is received with all fields correctly filled
    When An edit book request is received with correct book details
    Then the modified book should replace the original

  Scenario: An edit book request is received with incorrect ISBN value
    When An edit book request is received with incorrect ISBN
    Then the database should not be modified

  Scenario: An edit book request is received without author value
    When An edit book request is received without author
    Then the database should not be modified

  Scenario: An edit book request is received without title value
    When An edit book request is received without title
    Then the database should not be modified

  Scenario: An edit book request is received with author too long
    When An edit book request is received with author too long
    Then the database should not be modified

  Scenario: An edit book request is received with title too long
    When An edit book request is received with title too long
    Then the database should not be modified

  Scenario: An edit book request is received with incorrect date format
    When An edit book request is received with incorrect date format
    Then the database should not be modified

  Scenario: An edit book request is received with leading and trailing whitespace in fields but otherwise acceptable
    When An edit book request is received with leading and trailing whitespace in fields otherwise acceptable
    And the modified book should replace the original

  Scenario: An edit book request is received with leading and trailing whitespace in fields and otherwise unacceptable
    When An edit book request is received with leading and trailing whitespace in fields and unacceptable
    And the database should not be modified