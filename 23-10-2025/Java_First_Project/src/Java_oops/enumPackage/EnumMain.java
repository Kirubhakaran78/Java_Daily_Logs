/*
 * Decompiled with CFR 0.152.
 */
package Java_oops.enumPackage;

public class EnumMain {
    public static void main(String[] args) {
        Level myVar = Level.MEDIUM;
        System.out.println(myVar.getDescription());
    }

    static enum Level {
        LOW("Low level"),
        MEDIUM("Medium level"),
        High("High level");

        private String description;

        private Level(String description) {
            this.description = description;
        }

        public String getDescription() {
            return this.description;
        }
    }
}
