import { suite, it, expect } from 'vitest';
import { createPrinter } from '../src/generator/printer';
import { types } from '../src';

suite('printer', () => {
  it('should append correctly', async () => {
    const printer = createPrinter(types);

    printer.append('.btn {}');
    const output = await printer.get();

    expect(output).toBe('.btn {\n}\n');
  });

  it('should handle conditional new lines correctly', async () => {
    const printer = createPrinter(types);
    printer.append('.btn {}');
    printer.maybeNewline();

    let output = await printer.get();
    expect(output).toBe('.btn {\n}\n');

    printer.maybeNewline();
    output = await printer.get();
    expect(output).toBe('.btn {\n}\n');
  });

  it('should handle undefined tokens', async () => {
    const printer = createPrinter(types);
    printer.token();

    const output = await printer.get();
    expect(output).toBe('');
  });
});
