function myFunction() {
  try {
    // Get the active spreadsheet
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    if (!spreadsheet) {
      throw new Error("No active spreadsheet found. Open your Google Sheet and try again.");
    }

    // Get the active sheet
    var sheet = spreadsheet.getActiveSheet();
    if (!sheet) {
      throw new Error("No active sheet found in the spreadsheet.");
    }

    // Get all the data from the sheet
    var data = sheet.getDataRange().getValues();
    if (data.length < 2) {
      throw new Error("The sheet is empty or does not contain enough data. Ensure it has a header row and quiz data.");
    }

    // Create a new Google Form and set it as a quiz
    var form = FormApp.create('Quiz 2');
    form.setIsQuiz(true);

    // Add text input for Name
    form.addTextItem()
      .setTitle('Name')
      .setRequired(true);

    // Add text input for Email
    form.addTextItem()
      .setTitle('Email')
      .setRequired(true);

    // Add number input for Enrollment
    form.addTextItem()
      .setTitle('Enrollment Number')
      .setValidation(FormApp.createTextValidation()
        .setHelpText('Please enter a valid number')
        .requireNumber()
        .build())
      .setRequired(true);

    // Loop through each row of data (skipping the header row)
    for (var i = 1; i < data.length; i++) {
      var question = data[i][0]; // Column 1: Question
      var options = [data[i][1], data[i][2], data[i][3], data[i][4]]; // Columns 2-5: Options
      var correctAnswer = data[i][5]; // Column 6: Correct Answer

      // Skip rows with missing data
      if (!question || options.some(option => !option)) {
        Logger.log("Skipping row " + (i + 1) + " due to missing question or options.");
        continue;
      }

      // Add a multiple-choice question to the form
      var questionItem = form.addMultipleChoiceItem();
      questionItem.setTitle(question);
      
      // Create an array to store answer options
      var choiceItems = options.map(function(option) {
        return questionItem.createChoice(option, false);
      });

      // Set the correct answer if provided
      if (correctAnswer) {
        // Extract the correct answer's option text (e.g., "C) To build efficient, optimized solutions to complex problems")
        var correctAnswerText = correctAnswer.split(") ")[1]; // Get the part after "C) "
        
        // Find the matching choice and set it as correct
        for (var j = 0; j < options.length; j++) {
          if (options[j] === correctAnswerText) {
            choiceItems[j] = questionItem.createChoice(options[j], true);
            break;
          }
        }
      }

      // Set the choices and points for the question
      questionItem.setChoices(choiceItems);
      questionItem.setPoints(1);
    }

    // Log the form's edit and live URLs
    Logger.log('Form created successfully!');
    Logger.log('Edit URL: ' + form.getEditUrl());
    Logger.log('Live URL: ' + form.getPublishedUrl());

  } catch (error) {
    Logger.log("Error: " + error.message);
  }
}