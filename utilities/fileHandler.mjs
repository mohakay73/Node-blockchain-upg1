import { appendFileSync, readFileSync, writeFileSync } from 'fs';
import { join as joinPath } from 'path';

class FileHandler {
  constructor(folder, filename) {
    this.pathname = joinPath(__appdir, folder, filename);
  }

  append(data) {
    try {
      appendFileSync(this.pathname, `${data}\n`, 'utf8');
    } catch (error) {
      throw error;
    }
  }

  read(isJSON = false) {
    try {
      const data = readFileSync(this.pathname, 'utf8');

      if (isJSON) {
        const jsonData = JSON.parse(data);
        return jsonData.chain;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  write(data) {
    try {
      const jsonData = { chain: data };
      writeFileSync(this.pathname, JSON.stringify(jsonData, null, 2), 'utf8');
    } catch (error) {
      throw error;
    }
  }

  appendJSON(data) {
    try {
      const existingData = this.read(true);
      const newData = [...existingData, data];
      this.write(newData);
    } catch (error) {
      throw error;
    }
  }
}

export default FileHandler;
