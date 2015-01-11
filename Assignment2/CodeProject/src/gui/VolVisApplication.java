/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package gui;

import java.awt.BorderLayout;
import java.io.File;
import java.util.ArrayList;
import javax.media.opengl.awt.GLCanvas;
import javax.swing.JFileChooser;
import javax.swing.event.ChangeEvent;
import javax.swing.event.ChangeListener;
import javax.swing.filechooser.FileFilter;
import volume.Volume;
import volvis.CompositingRaycastRenderer;
import volvis.OpacityWeightingRayCaster;
import volvis.RaycastRenderer;
import volvis.TransferFunction;
import volvis.Visualization;

/**
 *
 * @author michel
 */
public class VolVisApplication extends javax.swing.JFrame {

    Visualization visualization;
    Volume volume;
    RaycastRenderer raycastRenderer;
    RaycastRenderer[] rayCasters = new RaycastRenderer[3];
    private int renderSelected = 0;

    /**
     * Creates new form VolVisApplication
     */
    public VolVisApplication() {

        initComponents();

        this.setTitle(
                "Volume visualization");

        // Create a new visualization for the OpenGL panel
        GLCanvas glCanvas = new GLCanvas();

        renderPanel.setLayout(
                new BorderLayout());
        renderPanel.add(glCanvas, BorderLayout.CENTER);
        visualization = new Visualization(glCanvas);

        glCanvas.addGLEventListener(visualization);

        rayCasters[0] = new RaycastRenderer();
        tabbedPanel.addTab("Mip Raycaster", rayCasters[0].getPanel());

        rayCasters[1] = new CompositingRaycastRenderer();
        tabbedPanel.addTab("Compositing Raycaster", rayCasters[1].getPanel());

        rayCasters[2] = new OpacityWeightingRayCaster();
        tabbedPanel.addTab("Opacity Weighting Raycaster", rayCasters[2].getPanel());

        visualization.addRenderer(rayCasters[0]);
        rayCasters[0].addTFChangeListener(visualization);

        raycastRenderer = rayCasters[0];

        tabbedPanel.addChangeListener(new ChangeListener() {
            @Override
            public void stateChanged(ChangeEvent e) {
                //0 is the load panel
                if (tabbedPanel.getSelectedIndex() != 0) {
                    updateRenderer(tabbedPanel.getSelectedIndex() - 1);
                }
            }
        });
    }

    /**
     * This method is called from within the constructor to initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is always
     * regenerated by the Form Editor.
     */
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        splitPane = new javax.swing.JSplitPane();
        tabbedPanel = new javax.swing.JTabbedPane();
        loadVolume = new javax.swing.JPanel();
        loadButton = new javax.swing.JButton();
        jScrollPane1 = new javax.swing.JScrollPane();
        infoTextPane = new javax.swing.JTextPane();
        sampleSlider = new javax.swing.JSlider();
        jLabel1 = new javax.swing.JLabel();
        resolutionSlider = new javax.swing.JSlider();
        jLabel2 = new javax.swing.JLabel();
        interpolationRadio = new javax.swing.JRadioButton();
        renderSelector = new javax.swing.JComboBox();
        renderPanel = new javax.swing.JPanel();

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);

        splitPane.setDividerLocation(600);

        loadButton.setText("Load volume");
        loadButton.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                loadButtonActionPerformed(evt);
            }
        });

        infoTextPane.setEditable(false);
        jScrollPane1.setViewportView(infoTextPane);

        sampleSlider.setMajorTickSpacing(10);
        sampleSlider.setOrientation(javax.swing.JSlider.VERTICAL);
        sampleSlider.setPaintLabels(true);
        sampleSlider.setPaintTicks(true);
        sampleSlider.setSnapToTicks(true);
        sampleSlider.setToolTipText("Resolution");
        sampleSlider.setName(""); // NOI18N
        sampleSlider.addChangeListener(new javax.swing.event.ChangeListener() {
            public void stateChanged(javax.swing.event.ChangeEvent evt) {
                sampleSliderStateChanged(evt);
            }
        });

        jLabel1.setText("Resolution");

        resolutionSlider.setMajorTickSpacing(10);
        resolutionSlider.setOrientation(javax.swing.JSlider.VERTICAL);
        resolutionSlider.setPaintLabels(true);
        resolutionSlider.setPaintTicks(true);
        resolutionSlider.setSnapToTicks(true);
        resolutionSlider.setToolTipText("Resolution");
        resolutionSlider.setName(""); // NOI18N
        resolutionSlider.addChangeListener(new javax.swing.event.ChangeListener() {
            public void stateChanged(javax.swing.event.ChangeEvent evt) {
                resolutionSliderStateChanged(evt);
            }
        });

        jLabel2.setText("Samples");

        interpolationRadio.setText("Interpolation");
        interpolationRadio.addItemListener(new java.awt.event.ItemListener() {
            public void itemStateChanged(java.awt.event.ItemEvent evt) {
                interpolationRadioItemStateChanged(evt);
            }
        });

        renderSelector.setModel(new javax.swing.DefaultComboBoxModel(new String[] { "RaycastRenderer", "CompositingRayCastRenderer", "OpacityWeightingRayCaster" }));
        renderSelector.addItemListener(new java.awt.event.ItemListener() {
            public void itemStateChanged(java.awt.event.ItemEvent evt) {
                renderSelectorItemStateChanged(evt);
            }
        });
        renderSelector.addPropertyChangeListener(new java.beans.PropertyChangeListener() {
            public void propertyChange(java.beans.PropertyChangeEvent evt) {
                renderSelectorPropertyChange(evt);
            }
        });

        javax.swing.GroupLayout loadVolumeLayout = new javax.swing.GroupLayout(loadVolume);
        loadVolume.setLayout(loadVolumeLayout);
        loadVolumeLayout.setHorizontalGroup(
            loadVolumeLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(loadVolumeLayout.createSequentialGroup()
                .addContainerGap()
                .addGroup(loadVolumeLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jScrollPane1)
                    .addGroup(loadVolumeLayout.createSequentialGroup()
                        .addComponent(loadButton)
                        .addGroup(loadVolumeLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(loadVolumeLayout.createSequentialGroup()
                                .addGap(12, 12, 12)
                                .addComponent(resolutionSlider, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                            .addGroup(loadVolumeLayout.createSequentialGroup()
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addComponent(jLabel1)))
                        .addGap(18, 18, 18)
                        .addGroup(loadVolumeLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addComponent(jLabel2)
                            .addGroup(loadVolumeLayout.createSequentialGroup()
                                .addComponent(sampleSlider, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addGroup(loadVolumeLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                                    .addComponent(interpolationRadio)
                                    .addComponent(renderSelector, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))))
                        .addGap(0, 0, Short.MAX_VALUE)))
                .addContainerGap())
        );
        loadVolumeLayout.setVerticalGroup(
            loadVolumeLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(loadVolumeLayout.createSequentialGroup()
                .addContainerGap()
                .addGroup(loadVolumeLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                    .addComponent(jLabel1)
                    .addComponent(jLabel2))
                .addGap(11, 11, 11)
                .addGroup(loadVolumeLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, loadVolumeLayout.createSequentialGroup()
                        .addComponent(interpolationRadio)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addComponent(renderSelector, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(162, 162, 162))
                    .addGroup(loadVolumeLayout.createSequentialGroup()
                        .addGroup(loadVolumeLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(loadButton)
                            .addComponent(resolutionSlider, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(sampleSlider, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)))
                .addComponent(jScrollPane1, javax.swing.GroupLayout.DEFAULT_SIZE, 240, Short.MAX_VALUE)
                .addContainerGap())
        );

        tabbedPanel.addTab("Load", loadVolume);

        splitPane.setRightComponent(tabbedPanel);

        javax.swing.GroupLayout renderPanelLayout = new javax.swing.GroupLayout(renderPanel);
        renderPanel.setLayout(renderPanelLayout);
        renderPanelLayout.setHorizontalGroup(
            renderPanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 598, Short.MAX_VALUE)
        );
        renderPanelLayout.setVerticalGroup(
            renderPanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 522, Short.MAX_VALUE)
        );

        splitPane.setLeftComponent(renderPanel);

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, layout.createSequentialGroup()
                .addComponent(splitPane, javax.swing.GroupLayout.DEFAULT_SIZE, 991, Short.MAX_VALUE)
                .addContainerGap())
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(splitPane)
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void interpolationRadioItemStateChanged(java.awt.event.ItemEvent evt) {//GEN-FIRST:event_interpolationRadioItemStateChanged
        visualization.interpolation = interpolationRadio.isSelected();
        visualization.update();
    }//GEN-LAST:event_interpolationRadioItemStateChanged

    private void resolutionSliderStateChanged(javax.swing.event.ChangeEvent evt) {//GEN-FIRST:event_resolutionSliderStateChanged
        visualization.pixelPercentage = resolutionSlider.getValue() / 100.0;
    }//GEN-LAST:event_resolutionSliderStateChanged

    private void sampleSliderStateChanged(javax.swing.event.ChangeEvent evt) {//GEN-FIRST:event_sampleSliderStateChanged
        int value = sampleSlider.getValue();
        if (value == 0) {
            value++;
        }
        visualization.samples = value;
        visualization.update();
    }//GEN-LAST:event_sampleSliderStateChanged

    private void loadButtonActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_loadButtonActionPerformed
        // TODO add your handling code here:
        JFileChooser fc = new JFileChooser();
        fc.setFileFilter(new FileFilter() {

            @Override
            public boolean accept(File f) {
                if (f.isFile()) {
                    if (f.getName().toLowerCase().endsWith(".fld")) {
                        return true;
                    }
                }
                if (f.isDirectory()) {
                    return true;
                }
                return false;
            }

            @Override
            public String getDescription() {
                return "AVS files";
            }
        });
        int returnVal = fc.showOpenDialog(this);
        if (returnVal == JFileChooser.APPROVE_OPTION) {
            File file = fc.getSelectedFile();
            volume = new Volume(file);

            String infoText = new String("Volume data info:\n");
            infoText = infoText.concat(file.getName() + "\n");
            infoText = infoText.concat("dimensions:\t\t" + volume.getDimX() + " x " + volume.getDimY() + " x " + volume.getDimZ() + "\n");
            infoText = infoText.concat("voxel value range:\t" + volume.getMinimum() + " - " + volume.getMaximum());
            infoTextPane.setText(infoText);
            rayCasters[0].setVolume(volume);
            rayCasters[1].setVolume(volume);
            rayCasters[2].setVolume(volume);
            visualization.update();

        }
    }//GEN-LAST:event_loadButtonActionPerformed

    private void renderSelectorPropertyChange(java.beans.PropertyChangeEvent evt) {//GEN-FIRST:event_renderSelectorPropertyChange

    }//GEN-LAST:event_renderSelectorPropertyChange

    private void renderSelectorItemStateChanged(java.awt.event.ItemEvent evt) {//GEN-FIRST:event_renderSelectorItemStateChanged

    }//GEN-LAST:event_renderSelectorItemStateChanged

    public void updateRenderer(int newSelected) {
        if (newSelected != renderSelected) {
            visualization.removeRenderer(raycastRenderer);
            rayCasters[renderSelected].removeTFChangeListener(visualization);

            visualization.addRenderer(rayCasters[newSelected]);
            rayCasters[newSelected].addTFChangeListener(visualization);
        }
        renderSelected = newSelected;
        raycastRenderer = rayCasters[renderSelected];

    }

    /**
     * @param args the command line arguments
     */
    public static void main(String args[]) {
        /* Set the Nimbus look and feel */
        //<editor-fold defaultstate="collapsed" desc=" Look and feel setting code (optional) ">
        /* If Nimbus (introduced in Java SE 6) is not available, stay with the default look and feel.
         * For details see http://download.oracle.com/javase/tutorial/uiswing/lookandfeel/plaf.html 
         */
        try {
            for (javax.swing.UIManager.LookAndFeelInfo info : javax.swing.UIManager.getInstalledLookAndFeels()) {
                if ("Nimbus".equals(info.getName())) {
                    javax.swing.UIManager.setLookAndFeel(info.getClassName());
                    break;

                }
            }
        } catch (ClassNotFoundException ex) {
            java.util.logging.Logger.getLogger(VolVisApplication.class
                    .getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (InstantiationException ex) {
            java.util.logging.Logger.getLogger(VolVisApplication.class
                    .getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (IllegalAccessException ex) {
            java.util.logging.Logger.getLogger(VolVisApplication.class
                    .getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (javax.swing.UnsupportedLookAndFeelException ex) {
            java.util.logging.Logger.getLogger(VolVisApplication.class
                    .getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }
        //</editor-fold>

        /* Create and display the form */
        java.awt.EventQueue.invokeLater(new Runnable() {
            public void run() {
                new VolVisApplication().setVisible(true);
            }
        });
    }
    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JTextPane infoTextPane;
    private javax.swing.JRadioButton interpolationRadio;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JButton loadButton;
    private javax.swing.JPanel loadVolume;
    private javax.swing.JPanel renderPanel;
    private javax.swing.JComboBox renderSelector;
    private javax.swing.JSlider resolutionSlider;
    private javax.swing.JSlider sampleSlider;
    private javax.swing.JSplitPane splitPane;
    private javax.swing.JTabbedPane tabbedPanel;
    // End of variables declaration//GEN-END:variables
}
