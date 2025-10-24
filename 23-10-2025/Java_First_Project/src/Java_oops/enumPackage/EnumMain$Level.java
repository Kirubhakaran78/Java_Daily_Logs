/*
 * Decompiled with CFR 0.152.
 */
package Java_oops.enumPackage;

static enum EnumMain.Level {
    LOW("Low level"),
    MEDIUM("Medium level"),
    High("High level");

    private String description;

    private EnumMain.Level(String description) {
        this.description = description;
    }

    public String getDescription() {
        return this.description;
    }
}
