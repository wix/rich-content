import { isEqual } from 'lodash';
import { COMMANDS, MODIFIERS, KeyBindingUtil } from 'wix-rich-content-editor-common';

const COMMAND_BY_SHORTCUT = [
  {
    command: COMMANDS.TITLE,
    modifiers: [MODIFIERS.COMMAND, MODIFIERS.SHIFT],
    key: '1',
  },
  {
    command: COMMANDS.SUBTITLE,
    modifiers: [MODIFIERS.COMMAND, MODIFIERS.SHIFT],
    key: '2',
  },
  {
    command: COMMANDS.ALIGN_LEFT,
    modifiers: [MODIFIERS.COMMAND, MODIFIERS.SHIFT],
    key: 'l',
  },
  {
    command: COMMANDS.ALIGN_RIGHT,
    modifiers: [MODIFIERS.COMMAND, MODIFIERS.SHIFT],
    key: 'r',
  },
  {
    command: COMMANDS.ALIGN_CENTER,
    modifiers: [MODIFIERS.COMMAND, MODIFIERS.SHIFT],
    key: 'e',
  },
  {
    command: COMMANDS.JUSTIFY,
    modifiers: [MODIFIERS.COMMAND, MODIFIERS.SHIFT],
    key: 'j',
  },
  {
    command: COMMANDS.NUMBERED_LIST,
    modifiers: [MODIFIERS.COMMAND, MODIFIERS.SHIFT],
    key: '7',
  },
  {
    command: COMMANDS.BULLETED_LIST,
    modifiers: [MODIFIERS.COMMAND, MODIFIERS.SHIFT],
    key: '8',
  },
  {
    command: COMMANDS.BLOCKQUOTE,
    modifiers: [MODIFIERS.COMMAND, MODIFIERS.SHIFT],
    key: '9',
  },
];

const {
  hasCommandModifier,
  usesMacOSHeuristics,
  isCtrlKeyCommand,
  isOptionKeyCommand,
} = KeyBindingUtil;

function getModifiers(e) {
  return [
    ...(hasCommandModifier(e) ? [MODIFIERS.COMMAND] : []),
    ...(usesMacOSHeuristics(e) && isCtrlKeyCommand(e) ? [MODIFIERS.CTRL] : []),
    ...(isOptionKeyCommand(e) ? [MODIFIERS.OPTION] : []),
    ...(e.shiftKey ? [MODIFIERS.SHIFT] : []),
    ...(e.altKey ? [MODIFIERS.ALT] : []),
  ];
}

function getCommandByShortcut(shortcut, bindingMap) {
  const commands = bindingMap
    .filter(mapped => mapped.key === shortcut.key && isEqual(mapped.modifiers, shortcut.modifiers))
    .map(mapped => mapped.command);

  return commands.length > 0 ? commands[0] : undefined;
}

export const createKeyBindingFn = customCommands => {
  const bindingMap = [...COMMAND_BY_SHORTCUT, ...customCommands];
  return e => {
    const shortcut = { modifiers: getModifiers(e), key: e.key };
    return getCommandByShortcut(shortcut, bindingMap);
  };
};

// merges all plugin TextButton keyBindings into an object { commands: [{ cmd1 }, ...], commandHandlers: { cmd1: handler1, ... } }
export const initPluginKeyBindings = pluginTextButtons =>
  pluginTextButtons.reduce(
    (bindings, buttonData, i) => {
      if (buttonData) {
        // iterate each button
        const buttonBindings = Object.keys(buttonData).reduce(
          (buttonBindings, key) => {
            if (buttonData[key].keyBindings && buttonData[key].keyBindings.length > 0) {
              // array of commands per button
              const buttonCommands = buttonData[key].keyBindings.map(binding => ({
                ...binding.keyCommand,
                // avoid cross-plugin name collisions
                command: `${binding.keyCommand.command}_${i}`,
              }));
              // handlers per button
              const buttonCommandHandlers = {};
              buttonData[key].keyBindings.forEach(binding => {
                buttonCommandHandlers[`${binding.keyCommand.command}_${i}`] =
                  binding.commandHandler;
              });
              // merge all button commands and handlers
              return {
                commands: [...buttonBindings.commands, ...buttonCommands],
                commandHandlers: { ...buttonBindings.commandHandlers, ...buttonCommandHandlers },
              };
            }
            return buttonBindings;
          },
          { commands: [], commandHandlers: {} }
        );
        // merge all commands and handlers
        return {
          commands: [...bindings.commands, ...buttonBindings.commands],
          commandHandlers: { ...bindings.commandHandlers, ...buttonBindings.commandHandlers },
        };
      }
      return bindings;
    },
    { commands: [], commandHandlers: {} }
  );
