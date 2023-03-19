/**
 *   @author: rebelliume <rebelliume@gmail.com>
 *   @version 0.0.2
 *   @copyright rebelliume (c) 2023 - all right reserved
 *
 *   @return {object}
 */

class terminal {
    /**
     * creating a selector to use in shorter format
     * also adding some useful function to use it in shorter format
     */
    #$ = {
        /**
         *  @param {string} ID
         *  @return {object}
         */
        ID: function () {
            return document.getElementById(arguments[0]);
        },
        /**
         *  @param {string} Class Name
         *  @return {object}
         */
        CLASS: function () {
            return document.getElementsByClassName(arguments[0]);
        },
        /**
         *  @param {string} Tag Name
         *  @return {object}
         */
        TAG: function () {
            return document.getElementsByTagName(arguments[0]);
        },
        /**
         *  @param {string} Name
         *  @return {object}
         */
        NAME: function () {
            return document.getElementsByName(arguments[0]);
        },
        /**
         *  @param {string} Value
         *  @return {object}
         */
        CREATE: function () {
            return document.createElement(arguments[0]);
        },
        /**
         *  @param {string} Object
         *  @param {string} Property
         *  @param {string} Value
         */
        SET: function () {
            arguments[0].setAttribute(arguments[1], arguments[2]);
        },
        /**
         *  @param {string} Object
         *  @param {string} Value
         */
        CSS: function () {
            arguments[0].style.cssText(arguments[1]);
        },
        /**
         *  @param {string} Value
         *  @param {string} Options
         */
        LOG: function () {
            console.log(arguments[0], arguments[1]);
        },
        /**
         *  @param {string} Value
         */
        ERROR: function () {
            console.error(arguments[0]);
        },
        /**
         *  @param {string} Value
         */
        WARN: function () {
            console.warn(arguments[0]);
        }
    };

    //store unique commands here
    #commands = new Map();
    //store commands help
    #commands_help = new Map();
    //create terminal elements of html
    #commands_history = [];
    #history_index = 0;
    //create terminal elements of html
    #elem = null;
    //hex variables include this numbers & characters only
    #hex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

    //init terminal attributes
    #attr = {
        title: null,
        path: null,
        user: null,
        height: null,
        width: null,
        opacity: null,
        fgColor: null,
        bgColor: null,
        fontName: null,
        fontSize: null,
        dateOption: null
    };

    //init random hex variables for terminal divs id
    #hexID = {
        title: this.#random(8),
        body: this.#random(8),
        text: this.#random(8),
        input: this.#random(8)
    }

    /**
     * constructor for terminal attributes
     *
     *  @param {string} Title
     *  @param {string} Path
     *  @param {string} User
     *  @param {string} Height
     *  @param {string} Width
     *  @param {number} Opacity
     *  @param {string} Foreground Color
     *  @param {string} Background Color
     *  @param {string} Font Name
     *  @param {number} Font Size
     *  @param {boolean} Date Option
     */
    constructor(
        _elem = 'terminal',
        _title = 'Terminal',
        _path = '/',
        _user = 'default',
        _height = innerHeight - 85 +'px',
        _width = '100%',
        _opacity = 0.85,
        _fgColor = '#ffffff',
        _bfColor = '#000000',
        _fontName = 'Lucida Console',
        _fontSize = 14,
        _dateOption = true
    ) {
        this.#elem = _elem;
        this.#attr.title = _title;
        this.#attr.path = _path;
        this.#attr.user = _user;
        this.#attr.height = _height;
        this.#attr.width = _width;
        this.#attr.opacity = _opacity;
        this.#attr.fgColor = _fgColor;
        this.#attr.bgColor = _bfColor;
        this.#attr.fontName = _fontName;
        this.#attr.fontSize = _fontSize;
        this.#attr.dateOption = _dateOption;
        //check if div element is implemented then create terminal elements
        if (this.#$.ID(this.#elem) instanceof HTMLDivElement) {
            this.#create();
        } else {
            this.#$.ERROR('element not implemented');
        }
    }

    /**
     * get random hex base on size & start with a character
     *
     *  @param {number} Size
     *  @return {string} Random Hex
     */
    #random() {
        if (arguments.length <= 0) {
            this.#$.ERROR('require args');
        }

        if (typeof arguments[0] !== 'undefined') if (typeof arguments[0] !== 'number') {
            this.#$.ERROR('arg type mismatch');
        }

        let result = [];

        for (let n = 0; n < arguments[0]; n++) {
            //if it is the first random char, set it as character
            if (n == 0) {
                result.push(this.#hex[Math.floor(Math.random() * (5) + 11)]);
            } else {
                result.push(this.#hex[Math.floor(Math.random() * 16)]);
            }
        }
        return result.join('');
    }

    /**
     * split commands into command & inputs
     *
     *  @param {string}
     *  @return {array}
     */
    #split() {
        if (arguments.length <= 0) {
            this.#$.ERROR('require args');
        }

        if (typeof arguments[0] !== 'undefined') if (typeof arguments[0] !== 'string') {
            this.#$.ERROR('arg type mismatch');
        }

        let output = [],
            current = null,
            holder = '',
            quote = false;

        function push() {
            (holder.slice(-1) === '"') ? holder = holder.slice(0, -1) : null;
            output.push(holder);
            holder = "";
        }

        //run on each character to split it
        for (let loop = 0; loop < arguments[0].length; loop++) {
            current = arguments[0].charAt(loop);

            (current === '"') ? quote = !quote : null;

            //separate single and double quot as single value
            (quote && current !== '"') ? holder += current : null;
            (!quote && current !== ' ') ? holder += current : null;

            //add to return array
            if (!quote && current === ' ') {
                push();
            } else if (loop === (arguments[0].length - 1)) {
                push();
            }
        }
        return output;
    }

    /**
     * create terminal elements & set its css style & events handler
     */
    #create() {
        let terminal = this.#$.ID(this.#elem),
            terminal_title = this.#$.CREATE('div'),
            terminal_body = this.#$.CREATE('div'),
            terminal_text = this.#$.CREATE('div'),
            terminal_input = this.#$.CREATE('span'),
            terminal_sign = this.#$.CREATE('span'),
            terminal_style = this.#$.CREATE('style');

        //convert hex color to rgb
        const convert = function func() {
            let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(arguments[0]);
            result = {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            }
            return result = `${result.r}, ${result.g}, ${result.b}`;
        }

        //apply animation & some custom css to head
        terminal_style.innerHTML = `#${this.#hexID.input}::before{ content: '$'; color: #999999; } #${this.#hexID.input}:focus{ animation: blink 1s step-end infinite; } @keyframes blink { from, to { border-color: transparent; } 50% { border-color: #ffffff; } } #${this.#hexID.text}::-webkit-scrollbar { width: 3px; } #${this.#hexID.text}::-webkit-scrollbar-track { background-color: rgba(66, 66, 66, 0.3); } #${this.#hexID.text}::-webkit-scrollbar-thumb { background-color: rgba(129, 129, 129, 0.79); } #${this.#hexID.text}::-webkit-scrollbar-thumb:hover { background-color: rgba(150, 150, 150, 0.79); } #${this.#elem}::selection { background-color: rgba(152, 152, 152, 0.79); }`;
        document.head.appendChild(terminal_style);

        //create elements of terminal
        this.#$.SET(terminal, 'style', `display: block; width: ${this.#attr.width}; height: ${this.#attr.height}; min-width: 360px; min-height: 200px; max-height: ${this.#attr.height}; color: ${this.#attr.fgColor}; font-size: ${this.#attr.fontSize}px; font-family: ${this.#attr.fontName}; z-index: 1; border: 4px solid #282c3a; border-radius: 4px;`);

        this.#$.SET(terminal_title, 'style', `width: 100%; height: 22px; padding-left: 1.5%;  user-select: none; -ms-user-select: none; -webkit-user-select: none; padding-top: 4px; background-color: #282c3a; color: white; font-size: 14px; font-weight: 100; z-index: 1;`);
        this.#$.SET(terminal_title, 'id', this.#hexID.title);
        terminal_title.innerText = this.#attr.title;

        this.#$.SET(terminal_body, 'style', `width: 100%; height: calc(100% - 23px); border-bottom-right-radius: 4px; border-bottom-left-radius: 4px; background-color: rgba(${convert(this.#attr.bgColor)},${this.#attr.opacity}); z-index: 1;`);
        this.#$.SET(terminal_body, 'id', this.#hexID.body);

        //create output screen element
        this.#$.SET(terminal_text, 'style', `display: inline-block; width: 98%; min-width: 0px; float: left; max-width: 98%; max-height: calc(${this.#attr.height} - 45px); font-size: ${this.#attr.fontSize}px; white-space: normal; margin-top: 3px; resize: none; user-select: none; -ms-user-select: none; -webkit-user-select: none; padding-left: 1%; height: auto; background-color: rgba(0, 0, 0, 0); color: white; border: none; border-right: 0px solid transparent; overflow-x: hidden; overflow-y: visible; caret-color: transparent; outline: none; z-index: 1; text-align: left; line-break: anywhere; word-break: normal;`);
        this.#$.SET(terminal_text, 'id', this.#hexID.text);

        //create input element
        this.#$.SET(terminal_input, 'style', `display: inline-block; width: auto; min-width: 6px; float: left; max-width: 97%; font-size: ${this.#attr.fontSize}; white-space: nowrap; resize: none; user-select: none; -ms-user-select: none; -webkit-user-select: none; padding-left: 1%; height: auto; background-color: rgba(0, 0, 0, 0); color: white; border: none; border-right: 6px solid transparent; overflow: hidden; caret-color: transparent; outline: none; z-index: 1; text-align: left; line-break: auto; word-break: normal;`);
        this.#$.SET(terminal_input, 'role', 'input');
        this.#$.SET(terminal_input, 'contentEditable', 'true');
        this.#$.SET(terminal_input, 'tabindex', '0');
        this.#$.SET(terminal_input, 'autofocus', 'true');
        this.#$.SET(terminal_input, 'id', this.#hexID.input);

        //applying elements on div
        terminal.append(terminal_title, terminal_body);
        terminal_body.append(terminal_text, terminal_input);

        //focus on input area
        const focus = () => {
            window.setTimeout(() => {
                //move cursor to the end
                let sel = window.getSelection();
                sel.selectAllChildren(this.#$.ID(terminal_input.id));
                sel.collapseToEnd();

                this.#$.ID(terminal_input.id).focus();
            }, 0);
        }
        focus();

        //process the input box and send it to execute
        const execute = () => {
            //log the command to log screen
            this.#$.ID(terminal_text.id).innerHTML += `$${this.#$.ID(terminal_input.id).innerText}<br>`;
            this.#$.ID(terminal_text.id).scrollTo(0, this.#$.ID(terminal_text.id).scrollHeight);
            //add command to history
            this.#add_command_history(this.#$.ID(terminal_input.id).innerText);
            //split the commands & go for execution
            this.#execute(this.#split(this.#$.ID(terminal_input.id).innerText));
            this.#$.ID(terminal_input.id).innerText = '';
        }

        //load default commands
        this.#default_command();

        //list of element to add event handler on
        const elements = [];
        elements.push(this.#hexID.title);
        elements.push(this.#hexID.body);
        elements.push(this.#hexID.text);

        //add events on elements to focus on textbox on click
        for (let i = 0; i <= (elements.length - 1); i++) {
            this.#$.ID(elements[i]).onfocus = function func() {
                focus();
            }
            this.#$.ID(elements[i]).onmousedown = function func() {
                focus();
            }
        }

        //looking up for older history commands
        const historyUp = () => {
            if (this.#history_index <= 0) {
                this.#history_index = 1;
            }

            if (this.#commands_history.length != 0) {
                this.#history_index -= 1;
                this.#$.ID(terminal_input.id).innerHTML = this.#commands_history[this.#history_index];
                focus();
            }
        }

        //looking up for newer history commands
        const historyDown = () => {
            if (this.#history_index < (this.#commands_history.length - 1)) {
                this.#history_index += 1;
                this.#$.ID(terminal_input.id).innerHTML = this.#commands_history[this.#history_index];
                focus();
            }
        }

        //get the command of input on pressing enter
        //disable arrow keys & mouse click on text position
        //add commands history to arrow key
        this.#$.ID(this.#hexID.input).onkeydown = function func(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                execute();
            } else if ((e.key === 'ArrowRight') || (e.key === 'ArrowLeft') || (e.key === 'End') || (e.key === 'Home')) {
                e.preventDefault();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                historyUp();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                historyDown();
            }
        }
        this.#$.ID(this.#hexID.input).onmousedown = function func(e) {
            e.preventDefault();
            e.stopPropagation();
            e.currentTarget.setSelectionRange(
                e.currentTarget.selectionEnd,
                e.currentTarget.selectionEnd,
            );
            e.currentTarget.focus();
        }
    }

    /**
     * add one zero if the number is single
     *
     *  @param {number} Value
     *  @return {string} Double
     */
    #add_zero() {
        if (arguments.length <= 0) {
            this.#$.ERROR('require args');
        }

        if (typeof arguments[0] !== 'undefined') if (typeof arguments[0] !== 'number') {
            this.#$.ERROR('arg type mismatch');
        }

        if (arguments[0] < 10) {
            arguments[0] = "0" + arguments[0]
        }
        return arguments[0].toString();
    }

    /**
     * public version of logging on terminal output
     *
     *  @param {string} Text
     *  @param {string} Color Code
     */
    log() {
        this.#log(arguments[0], arguments[1]);
    }

    /**
     * log on terminal output
     *
     *  @param {string} Text
     *  @param {string} Color Code
     */
    #log() {
        if (arguments.length <= 0) {
            this.#$.ERROR('require args');
        }

        if (typeof arguments[0] !== 'undefined') if (typeof arguments[0] !== 'string') {
            this.#$.ERROR('arg type mismatch');
        }
        if (typeof arguments[1] !== 'undefined') if (typeof arguments[1] !== 'string') {
            this.#$.ERROR('arg type mismatch');
        }

        let color = null,
            dateString = '',
            logID = `log${Date.now().toString()}`,
            date = new Date();

        //set color
        if (arguments[1] == null) {
            color = '#ffffff';
        } else {
            color = arguments[1];
        }

        if (arguments[0] != null) {
            //create unique id div & insert new line into
            this.#$.ID(this.#hexID.text).innerHTML += `<div style="color:${color};" id="${logID}"></div>`;

            if (this.#attr.dateOption === true) {
                dateString = `[${this.#add_zero(date.getHours())}:${this.#add_zero(date.getMinutes())}:${this.#add_zero(date.getSeconds())}:${this.#add_zero(date.getMilliseconds()).toString().slice(0, 2)}]`;
                this.#$.ID(logID).innerHTML = `${dateString} ${arguments[0].toString()}`;
            } else {
                this.#$.ID(logID).innerHTML = arguments[0].toString();
            }

            //scroll to last of log area
            this.#$.ID(this.#hexID.text).scrollTo(0, this.#$.ID(this.#hexID.text).scrollHeight);
        }
    }

    /**
     * public version of adding command to terminal
     *
     *  @param {string} Command
     *  @param {object} Function
     *  @param {string} Instruction
     */
    add_command() {
        this.#add_command(arguments[0], arguments[1], arguments[2]);
    }

    /**
     * add command to terminal
     *
     *  @param {string} Command
     *  @param {object} Function
     *  @param {string} Instruction
     */
    #add_command() {
        if (arguments.length <= 0) {
            this.#$.ERROR('require args');
        }

        if (typeof arguments[0] !== 'undefined') if (typeof arguments[0] !== 'string') {
            this.#$.ERROR('arg type mismatch');
        }
        if (typeof arguments[1] !== 'undefined') if (typeof arguments[1] !== 'function') {
            this.#$.ERROR('arg type mismatch');
        }
        if (typeof arguments[2] !== 'undefined') if (typeof arguments[2] !== 'string') {
            this.#$.ERROR('arg type mismatch');
        }

        if ((arguments[0] != null && arguments[0] != '') && (arguments[1] != null)) {
            this.#commands.set(arguments[0].toString().toLowerCase(), arguments[1]);
            this.#commands_help.set(arguments[0].toString().toLowerCase(), arguments[2]);
        }
    }

    /**
     * public version of removing command from terminal
     *
     *  @param {string} Command
     */
    remove_command() {
        this.#remove_command(arguments[0]);
    }

    /**
     * remove command from terminal
     *
     *  @param {string} Command
     */
    #remove_command() {
        if (arguments.length <= 0) {
            this.#$.ERROR('require args');
        }

        if (typeof arguments[0] !== 'undefined') if (typeof arguments[0] !== 'string') {
            this.#$.ERROR('arg type mismatch');
        }

        if ((arguments[0] != null && arguments[0] != '')) {
            this.#commands.delete(arguments[0].toString().toLowerCase());
            this.#commands_help.delete(arguments[0].toString().toLowerCase());
        }
    }

    /**
     * add command to terminal history
     *
     *  @param {string} Command
     */
    #add_command_history() {
        if (arguments.length <= 0) {
            this.#$.ERROR('require args');
        }

        if (typeof arguments[0] !== 'undefined') if (typeof arguments[0] !== 'string') {
            this.#$.ERROR('arg type mismatch');
        }

        if (arguments[0] != null && arguments[0] != '') {
            //check if it is the first index of history array
            if (this.#commands_history.length == 0) {
                this.#commands_history.push(arguments[0].toString().toLowerCase());
            } else {
                //check if the previous command history is not the same
                if (this.#commands_history[this.#commands_history.length - 1] != arguments[0].toString().toLowerCase()) {
                    //add command to history array
                    this.#commands_history.push(arguments[0].toString().toLowerCase());
                }
            }
            //updating the history index
            this.#history_index = (this.#commands_history.length);
        }
    }

    /**
     * load default terminal commands
     */
    #default_command() {
        //clear the log area screen
        this.#add_command('clear', function () {
            this.#$.ID(this.#hexID.text).innerHTML = '';
        }, 'clear terminal screen');

        //list added commands with its help instruction
        this.#add_command('help', function () {
            let _data = '';
            for (let [key, value] of this.#commands_help) {
                _data += `${key}: ${value}<br>`;
            }
            this.#log(_data);
        }, 'commands & helps');
    }

    /**
     * execute commands passed
     *
     *  @param {array} Commands
     */
    #execute() {
        if (arguments.length <= 0) {
            this.#$.ERROR('require args');
        }

        if (typeof arguments[0] !== 'undefined') if (typeof arguments[0] !== 'object') {
            this.#$.ERROR('arg type mismatch');
        }

        if (arguments[0][0] != undefined && arguments[0][0] != '') {
            //check if the command exist then execute
            if (this.#commands.has(arguments[0][0].toLowerCase())) {
                //load & run the function
                const run = () => this.#commands.get(arguments[0][0].toLowerCase());
                run().call(this, arguments[0]);
            } else {
                this.#log('unknown command executed');
            }
        } else {
            this.#log('');
        }
    }
}