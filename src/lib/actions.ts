
export function validate(input: HTMLInputElement, validator: (x: string) => string) {
    function v() {
        input.setCustomValidity(validator(input.value) ?? '');
    }

    input.addEventListener('input', v);
    v();

    return {
        destroy() {
            input.removeEventListener('input', v);
        }
    };
}