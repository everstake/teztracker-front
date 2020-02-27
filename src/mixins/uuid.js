import { v4 as uuidv4 } from "uuid";

export default {
  methods: {
    generateKey() {
      return uuidv4();
    }
  }
};
