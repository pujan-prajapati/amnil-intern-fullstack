import { z } from "zod";

// validate id
export const validateId = (id: string) => {
  const validation = z.string().uuid().safeParse(id);

  if (validation.success) {
    return validation;
  } else {
    throw new Error("Invalid ID");
  }
};
