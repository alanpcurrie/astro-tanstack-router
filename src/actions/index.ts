// src/actions/index.ts
import { defineAction, ActionError } from "astro:actions";
import { z } from "astro:content";

export const server = {
  startTimer: defineAction({
    input: z.object({
      duration: z.number().int().positive().max(60),
    }),
    handler: async ({ duration }) => {
      await new Promise((resolve) => setTimeout(resolve, duration * 1000));

      return {
        message: `Timer completed after ${duration} seconds.`,
      };
    },
  }),

  startLongTimer: defineAction({
    input: z.object({
      duration: z.number().int().positive(),
    }),
    handler: async ({ duration }) => {
      if (duration > 300) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: "Duration exceeds the maximum allowed time of 300 seconds.",
        });
      }

      await new Promise((resolve) => setTimeout(resolve, duration * 1000));

      return {
        message: `Long timer completed after ${duration} seconds.`,
      };
    },
  }),
};
