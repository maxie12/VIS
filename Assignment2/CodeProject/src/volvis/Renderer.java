/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package volvis;

import java.util.ArrayList;
import javax.media.opengl.GL;
import javax.media.opengl.GL2;
import util.TFChangeListener;

/**
 *
 * @author michel
 */
public abstract class Renderer {

    int winWidth, winHeight;
    boolean visible = false;
    boolean interactiveMode = false;
    ArrayList<TFChangeListener> listeners = new ArrayList<TFChangeListener>();
    //What percentage of the pixels to display, Range from 0.0 tot 1.0
    double pixelPercentage = 1.0;
    int samples = 10;
    boolean interpolation = false;

    public Renderer() {

    }

    public void setInteractiveMode(boolean flag) {
        interactiveMode = flag;
    }

    public void setWinWidth(int w) {
        winWidth = w;
    }

    public void setWinHeight(int h) {
        winHeight = h;
    }

    public int getWinWidth() {
        return winWidth;
    }

    public int getWinHeight() {
        return winHeight;
    }

    public void updateSamples(int samples) {
        this.samples = samples;
    }

    public void updateResolution(double pixelPercentage) {
        this.pixelPercentage = pixelPercentage;
    }

    public void updateInterpolation(boolean interpolation) {
        this.interpolation = interpolation;
    }

    public void setVisible(boolean flag) {
        visible = flag;
    }

    public boolean getVisible() {
        return visible;
    }

    public void addTFChangeListener(TFChangeListener l) {
        if (!listeners.contains(l)) {
            listeners.add(l);
        }
    }

    public void removeTFChangeListener(TFChangeListener l) {
        if (listeners.contains(l)) {
            listeners.remove(l);
        }
    }

    public abstract void visualize(GL2 gl);
}
