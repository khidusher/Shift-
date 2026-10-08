export function setPressedChoice(choices, selected) {
  choices.forEach((choice) => {
    choice.setAttribute('aria-pressed', String(choice === selected));
  });
}
