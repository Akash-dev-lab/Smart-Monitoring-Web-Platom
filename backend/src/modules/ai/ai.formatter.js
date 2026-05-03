export const formatAIResponse = (raw) => {
  try {
    if (!raw) throw new Error("Empty AI response");

    const jsonMatch = raw.match(/\{[\s\S]*\}/);

    if (!jsonMatch) throw new Error("No JSON found");

    const parsed = JSON.parse(jsonMatch[0]);

    // 🔥 NORMALIZE SUGGESTIONS (CRITICAL FIX)
    const suggestions = Array.isArray(parsed.suggestion)
      ? parsed.suggestion
      : parsed.suggestion
        ? [parsed.suggestion]
        : [];

    return {
      status: parsed.status || "UNKNOWN",
      reason: parsed.reason || "No reason provided",
      suggestion: suggestions
    };

  } catch (err) {
    return {
      status: "ERROR",
      reason: "AI parsing failed",
      suggestion: raw ? [raw] : ["No AI response"]
    };
  }
};